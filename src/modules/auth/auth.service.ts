import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/users.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from 'src/entities/refreshTokens.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password } = signupDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) throw new ConflictException('Email already exists');

    const user = this.userRepository.create({
      email: email,
      passwordHash: await this.hashData(password),
    });

    await this.userRepository.save(user);

    // Generate token
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const tokens = await this.getTokens(payload);

    return tokens;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await this.verifyHash(password, user.passwordHash);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    // Generate token
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const tokens = await this.getTokens(payload);

    await this.saveRefreshToken(tokens.refreshToken, user.id);

    return tokens;
  }

  async refreshToken(refreshToken: string) {
    const tokenHash = await this.hashData(refreshToken);
    const existingToken = await this.refreshTokenRepository.findOne({
      where: { tokenHash, revoked: false },
      relations: { user: true },
    });
    if (!existingToken)
      throw new UnauthorizedException('Invalid or revoked token.');
    if (new Date() > existingToken.expiredAt)
      throw new UnauthorizedException('Token has expired.');

    // Generate new token pair
    const payload: JwtPayload = {
      sub: existingToken.user.id,
      email: existingToken.user.email,
    };
    const newTokens = await this.getTokens(payload);

    await this.saveRefreshToken(newTokens.refreshToken, existingToken.userId);

    return newTokens;
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const tokenHash = await this.hashData(refreshToken);
    const entity = await this.refreshTokenRepository.findOne({
      where: { tokenHash },
    });
    if (!entity) throw new UnauthorizedException('Invalid token.');

    entity.revoked = true;
    await this.refreshTokenRepository.save(entity);
  }

  private async saveRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<RefreshToken> {
    const decoded = this.jwtService.decode(refreshToken) as { exp: number };
    const tokenHash = refreshToken; // You can hash this if required

    const refreshTokenEntity = this.refreshTokenRepository.create({
      tokenHash,
      userId: userId,
      expiredAt: new Date(decoded.exp * 1000),
    });

    await this.refreshTokenRepository.delete({ userId });
    return this.refreshTokenRepository.save(refreshTokenEntity);
  }

  private async getTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.accessSecret'),
        expiresIn: this.configService.get('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshIn'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, this.configService.get('jwt.bcryptSaltOrRound'));
  }

  private async verifyHash(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData);
  }
}

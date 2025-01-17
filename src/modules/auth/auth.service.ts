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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ accessToken: string }> {
    const { email, password } = signupDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) throw new ConflictException('Email already exists');

    const user = new User();
    user.email = email;
    user.password = password;

    await this.userRepository.save(user);

    // Generate token
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Find existing token pair
    const existingToken = await this.accessTokenRepo.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!existingToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Find user
    const user = await this.userRepo.findOne({
      where: { id: existingToken.resource_owner_id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new token pair
    const payload = { sub: user.id, email: user.email };
    const newAccessToken = await this.jwtService.signAsync(payload);
    const newRefreshToken = crypto.randomBytes(40).toString('hex');

    // Update in database
    await this.accessTokenRepo.update(existingToken.id, {
      token: newAccessToken,
      refresh_token: newRefreshToken,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async createTokenPair(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = crypto.randomBytes(40).toString('hex');

    // Save to database
    await this.accessTokenRepo.save({
      token: accessToken,
      refresh_token: refreshToken,
      resource_owner_id: user.id,
      resource_owner_type: 'User',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async revokeToken(accessToken: string): Promise<void> {
    await this.accessTokenRepo.delete({ token: accessToken });
  }
}

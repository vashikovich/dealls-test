import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { RefreshToken } from 'src/entities/refreshTokens.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refreshToken.dto';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

describe('AuthController (Integration)', () => {
  let app: INestApplication;
  let authController: AuthController;
  let userRepository: Repository<User>;
  let refreshTokenRepository: Repository<RefreshToken>;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              jwt: {
                accessSecret: 'testAccessSecret',
                refreshSecret: 'testRefreshSecret',
                expiresIn: '1h',
                refreshIn: '7d',
                bcryptSaltOrRound: 10,
              },
            }),
          ],
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, RefreshToken],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, RefreshToken]),
        JwtModule.register({}),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    authController = module.get<AuthController>(AuthController);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    refreshTokenRepository = module.get<Repository<RefreshToken>>(
      getRepositoryToken(RefreshToken),
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    await userRepository.clear();
    await refreshTokenRepository.clear();
  });

  describe('signup', () => {
    it('should create a new user and return tokens', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const result = await authController.signup(signupDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');

      const user = await userRepository.findOne({
        where: { email: signupDto.email },
      });
      expect(user).toBeDefined();
      expect(user?.email).toEqual(signupDto.email);
    });

    it('should throw a conflict error for duplicate email', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'Password123',
      };
      await authController.signup(signupDto);

      await expect(authController.signup(signupDto)).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should log in an existing user and return tokens', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'Password123',
      };
      await authController.signup(signupDto);

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123',
      };
      const result = await authController.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw an unauthorized error for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'WrongPassword',
      };

      await expect(authController.login(loginDto)).rejects.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should generate new tokens using a valid refresh token', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'Password123',
      };
      const { refreshToken } = await authController.signup(signupDto);

      const result = await authController.refreshToken({ refreshToken });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw an unauthorized error for an invalid refresh token', async () => {
      await expect(
        authController.refreshToken({ refreshToken: 'invalidToken' }),
      ).rejects.toThrow('Invalid or revoked token.');
    });

    it('should return UnauthorizedException for expired refresh token', async () => {
      const expiredRefreshToken = 'expired-token-example';

      const expiredTokenPayload = {
        sub: 'user-id', // mock user ID
        email: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired token (1 hour ago)
      };

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockResolvedValueOnce(expiredTokenPayload as any);

      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: expiredRefreshToken,
      };

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send(refreshTokenDto)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body.message).toBe('Token has expired.');
        });
    });
  });
});

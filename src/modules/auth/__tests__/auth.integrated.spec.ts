import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refreshToken.dto';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';

describe('AuthController (Integration)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const dataSource = app.get(DataSource);
    userRepository = dataSource.getRepository(User);
    jwtService = new JwtService();
  });

  afterEach(async () => {
    const entityManager = app.get(EntityManager);
    const tableNames = entityManager.connection.entityMetadatas
      .map((entity) => entity.tableName)
      .join(', ');

    await entityManager.query(
      `truncate ${tableNames} restart identity cascade;`,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('signup', () => {
    it('should create a new user and return tokens', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

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
      await request(app.getHttpServer()).post('/auth/signup').send(signupDto);

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('login', () => {
    it('should log in an existing user and return tokens', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      await request(app.getHttpServer()).post('/auth/signup').send(signupDto);

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should throw an unauthorized error for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'WrongPassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('refreshToken', () => {
    it('should generate new tokens using a valid refresh token', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should throw an unauthorized error for an invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalidToken' })
        .expect(401);
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
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});

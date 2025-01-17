import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessToken } from 'src/entities/accessTokens.entity';
import { AUTH_STRATEGY } from 'src/constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGY.REFRESH_TOKEN,
) {
  constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepo: Repository<AccessToken>,
  ) {
    super();
  }

  async validate(request: any): Promise<any> {
    const refreshToken = request.body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const tokenEntry = await this.accessTokenRepo.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!tokenEntry) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return tokenEntry;
  }
}

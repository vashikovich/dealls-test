import { RefreshTokenDto } from '../refreshToken.dto';
import { validate } from 'class-validator';

describe('RefreshTokenDto', () => {
  let dto: RefreshTokenDto;

  beforeEach(() => {
    dto = new RefreshTokenDto();
  });

  it('should validate successfully with valid data', async () => {
    dto.refreshToken = 'validRefreshToken123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail if refreshToken is missing', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('refreshToken');
  });

  it('should fail if refreshToken is an empty string', async () => {
    dto.refreshToken = '';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('refreshToken');
  });
});

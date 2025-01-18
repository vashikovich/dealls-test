import { LoginDto } from '../login.dto';
import { validate } from 'class-validator';

describe('LoginDto', () => {
  let dto: LoginDto;

  beforeEach(() => {
    dto = new LoginDto();
  });

  it('should validate successfully with valid data', async () => {
    dto.email = 'test@example.com';
    dto.password = 'ValidPassword123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail if email is undefined', async () => {
    dto.password = 'ValidPassword123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail if email is null', async () => {
    dto.email = null;
    dto.password = 'ValidPassword123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail if email is an empty string', async () => {
    dto.email = '';
    dto.password = 'ValidPassword123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail if email is invalid', async () => {
    dto.email = 'invalid-email';
    dto.password = 'ValidPassword123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail if password is undefined', async () => {
    dto.email = 'test@example.com';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });

  it('should fail if password is null', async () => {
    dto.email = 'test@example.com';
    dto.password = null;
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });

  it('should fail if password is an empty string', async () => {
    dto.email = 'test@example.com';
    dto.password = '';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });

  it('should fail if email and password are both missing', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(2);
    const errorProperties = errors.map((error) => error.property);
    expect(errorProperties).toContain('email');
    expect(errorProperties).toContain('password');
  });
});

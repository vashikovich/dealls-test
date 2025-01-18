import { SignupDto } from '../signup.dto';
import { validate } from 'class-validator';

describe('SignupDto', () => {
  let dto: SignupDto;

  beforeEach(() => {
    dto = new SignupDto();
  });

  it('should validate successfully with valid data', async () => {
    dto.email = 'test@example.com';
    dto.password = 'Valid123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail if email is undefined', async () => {
    dto.password = 'Valid123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail if email is null', async () => {
    dto.email = null;
    dto.password = 'Valid123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail if email is an empty string', async () => {
    dto.email = '';
    dto.password = 'Valid123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail if password is undefined', async () => {
    dto.email = 'test@example.com';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail if password is null', async () => {
    dto.email = 'test@example.com';
    dto.password = null;
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail if email is invalid', async () => {
    dto.email = 'not-an-email';
    dto.password = 'Valid123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail if password is less than 8 characters', async () => {
    dto.email = 'test@example.com';
    dto.password = 'Short1!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should fail if password does not contain at least one uppercase letter', async () => {
    dto.email = 'test@example.com';
    dto.password = 'invalid123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should fail if password does not contain at least one lowercase letter', async () => {
    dto.email = 'test@example.com';
    dto.password = 'INVALID123!';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should fail if password does not contain at least one number or special character', async () => {
    dto.email = 'test@example.com';
    dto.password = 'InvalidPass';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should fail if email and password are both missing', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(2);
    const errorProperties = errors.map((error) => error.property);
    expect(errorProperties).toContain('email');
    expect(errorProperties).toContain('password');
  });
});

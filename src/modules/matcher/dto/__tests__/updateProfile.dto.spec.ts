import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Gender } from 'src/enums/gender.enum';
import { UpdateProfileDto } from '../updateProfile.dto';

describe('UpdateProfileDto', () => {
  it('should allow valid data', async () => {
    const dtoInstance = plainToInstance(UpdateProfileDto, {
      name: 'John Doe',
      birthDate: '1990-01-01',
      bio: 'Hello! I love coding and hiking.',
      gender: Gender.MALE,
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(0);
  });

  it('should fail when name is missing', async () => {
    const dtoInstance = plainToInstance(UpdateProfileDto, {
      birthDate: '1990-01-01',
      gender: Gender.MALE,
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should fail when name is empty', async () => {
    const dtoInstance = plainToInstance(UpdateProfileDto, {
      name: '',
      birthDate: '1990-01-01',
      gender: Gender.MALE,
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should fail when birthDate is missing', async () => {
    const dtoInstance = plainToInstance(UpdateProfileDto, {
      name: 'John Doe',
      gender: Gender.MALE,
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('birthDate');
  });

  it('should fail when birthDate is not a valid date', async () => {
    const dtoInstance = plainToInstance(UpdateProfileDto, {
      name: 'John Doe',
      birthDate: 'invalid-date',
      gender: Gender.MALE,
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('birthDate');
  });

  it('should allow bio to be optional', async () => {
    const dtoInstance = plainToInstance(UpdateProfileDto, {
      name: 'John Doe',
      birthDate: '1990-01-01',
      gender: Gender.MALE,
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(0);
  });

  it('should fail when bio is not a string', async () => {
    const dtoInstance = plainToInstance(UpdateProfileDto, {
      name: 'John Doe',
      birthDate: '1990-01-01',
      bio: 123, // Invalid type
      gender: Gender.MALE,
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('bio');
  });

  it('should fail when gender is missing', async () => {
    const dtoInstance = plainToInstance(UpdateProfileDto, {
      name: 'John Doe',
      birthDate: '1990-01-01',
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('gender');
  });

  it('should fail when gender is not a valid enum value', async () => {
    const dtoInstance = plainToInstance(UpdateProfileDto, {
      name: 'John Doe',
      birthDate: '1990-01-01',
      gender: 'InvalidGender', // Not part of Gender enum
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('gender');
  });
});

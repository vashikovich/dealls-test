import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GetCandidatesDto } from '../getCandidates.dto';

describe('GetCandidatesDto', () => {
  it('should allow valid data', async () => {
    const dtoInstance = plainToInstance(GetCandidatesDto, {
      skipUserIds: [
        '1020cd75-8ed7-4eb0-9e59-0afb5b4fff84',
        '3adf743a-7921-411b-8815-c9f8a33c8ba6',
      ],
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(0);
  });

  it('should allow undefined skipUserIds', async () => {
    const dtoInstance = plainToInstance(GetCandidatesDto, {});

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(0);
  });

  it('should fail when skipUserIds is not an array', async () => {
    const dtoInstance = plainToInstance(GetCandidatesDto, {
      skipUserIds: '3adf743a-7921-411b-8815-c9f8a33c8ba6', // Invalid: not an array
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('skipUserIds');
  });

  it('should fail when skipUserIds contains non-string elements', async () => {
    const dtoInstance = plainToInstance(GetCandidatesDto, {
      skipUserIds: [123, '3adf743a-7921-411b-8815-c9f8a33c8ba6'], // Invalid: contains a number
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('skipUserIds');
  });

  it('should fail when skipUserIds contains invalid UUIDs', async () => {
    const dtoInstance = plainToInstance(GetCandidatesDto, {
      skipUserIds: ['invalid-uuid', 'another-invalid-uuid'], // Invalid UUIDs
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('skipUserIds');
  });
});

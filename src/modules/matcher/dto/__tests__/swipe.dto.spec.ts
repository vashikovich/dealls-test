import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SwipeDto } from '../swipe.dto';

describe('SwipeDto', () => {
  it('should allow valid data', async () => {
    const dtoInstance = plainToInstance(SwipeDto, {
      targetUserId: '3adf743a-7921-411b-8815-c9f8a33c8ba6',
      isLike: true,
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(0);
  });

  it('should fail when targetUserId is missing', async () => {
    const dtoInstance = plainToInstance(SwipeDto, {
      isLike: true,
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('targetUserId');
  });

  it('should fail when targetUserId is null', async () => {
    const dtoInstance = plainToInstance(SwipeDto, {
      targetUserId: null,
      isLike: true,
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('targetUserId');
  });

  it('should fail when targetUserId is not a UUID', async () => {
    const dtoInstance = plainToInstance(SwipeDto, {
      targetUserId: 'invalid-id',
      isLike: true,
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('targetUserId');
  });

  it('should fail when isLike is missing', async () => {
    const dtoInstance = plainToInstance(SwipeDto, {
      targetUserId: '3adf743a-7921-411b-8815-c9f8a33c8ba6',
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('isLike');
  });

  it('should fail when isLike is null', async () => {
    const dtoInstance = plainToInstance(SwipeDto, {
      targetUserId: '3adf743a-7921-411b-8815-c9f8a33c8ba6',
      isLike: null,
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('isLike');
  });

  it('should fail when isLike is not a boolean', async () => {
    const dtoInstance = plainToInstance(SwipeDto, {
      targetUserId: '3adf743a-7921-411b-8815-c9f8a33c8ba6',
      isLike: 'true', // Invalid: must be a boolean
    });

    const errors = await validate(dtoInstance);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('isLike');
  });
});

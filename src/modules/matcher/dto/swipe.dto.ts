import { IsUUID, IsBoolean } from 'class-validator';

export class SwipeDto {
  @IsUUID('4')
  targetUserId: string;

  @IsBoolean()
  isLike: boolean;
}

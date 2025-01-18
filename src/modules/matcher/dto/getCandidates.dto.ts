import { IsArray, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class GetCandidatesDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  skipUserIds?: string[];

  @IsNumber()
  @IsOptional()
  amount?: number;
}

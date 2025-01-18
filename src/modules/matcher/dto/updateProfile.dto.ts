import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Gender } from 'src/enums/gender.enum';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}

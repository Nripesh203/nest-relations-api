import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;
}

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}

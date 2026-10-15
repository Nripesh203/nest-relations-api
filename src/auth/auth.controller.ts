import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './authService';
import { RegisterDto } from '../DTO/Register.dto';
import { LoginDto } from '../DTO/Login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

import { Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({passthrough: true}) res: Response){
    
    const result = await this.authService.login(dto)
    const {refreshToken, ...response} = result
    return result
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({passthrough: true}) res: Response){
    const result = await this.authService.register(dto)
    const {refreshToken, ...response} = result
    return result
  }

  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(@Req() req: Request){
    const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME]
    
    if(!refreshTokenFromCookies){
      throw new UnauthorizedException('Refresh token not passed')
    }

    const response = await this.authService.getNewTokens(refreshTokenFromCookies)
    return response
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Res({passthrough: true}) res: Response){
    return true
  }
}
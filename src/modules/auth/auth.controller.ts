import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthGuard } from "./auth.guard"
import { LoginDto } from "./dto/login.dto"
import { ProfileDto } from "./dto/profile.dto"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.signIn(loginDto)
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(@Request() req: Request & { user: ProfileDto }): ProfileDto {
    return req.user
  }
}

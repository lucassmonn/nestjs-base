import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "../user/user.service"
import { LoginDto } from "./dto/login.dto"
import { compare } from "../../util/encrypt.util"

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto
    const user = await this.userService.findOneWithPasswordByEmail(email)

    if (!compare(password, user.password)) {
      throw new UnauthorizedException()
    }

    const payload = { sub: user._id, email: user.email, id: user._id }

    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}

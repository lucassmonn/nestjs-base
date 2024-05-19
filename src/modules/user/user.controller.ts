import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { User } from "./entities/user.entity"
import { Public } from "../auth/public.decorator"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<User> {
    return this.userService.findOne(id)
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto)
  }
}

import { Injectable } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User } from "./entities/user.entity"
import { hash } from "src/util/encrypt.util"

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await hash(createUserDto.password)
    const userModel = new this.userModel(createUserDto)
    await userModel.save()
    userModel.password = undefined
    return userModel
  }

  findAll(): Promise<User[]> {
    const users = this.userModel.find()
    return users.exec()
  }

  findOne(id: string): Promise<User> {
    const user = this.userModel.findById(id)
    return user.exec()
  }

  findOneWithPasswordByEmail(email: string): Promise<User> {
    const user = this.userModel.findOne({ email }).select("+password")
    return user.exec()
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    })
    return user.exec()
  }

  remove(id: string): Promise<User> {
    const user = this.userModel.findByIdAndDelete(id)
    return user.exec()
  }
}

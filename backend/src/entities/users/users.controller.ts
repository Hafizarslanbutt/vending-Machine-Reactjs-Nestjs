import {
  Body,
  Controller,
  Get,
  Put,
  Request,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/createUserDto';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/gurads/jwt-auth.guard';
import * as bcrypt from 'bcrypt';
// import { ProductBuy } from '../product/dto/productDto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get()
  getUsers(@Request() req) {
    return this.userService.get(req.user.username);
  }

  @UseGuards(JwtGuard)
  @Put('update')
  async updateUsers(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }
    return this.userService.update(req.user._id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete('remove')
  deleteUsers(@Body() body: { username: 'string' }) {
    return this.userService.delete(body.username);
  }

  @UseGuards(JwtGuard)
  @Patch('update/deposit')
  updateUsersDeposit(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.userService.updateDeposit(req.user._id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Patch('reset/deposit')
  resetDeposit(@Request() req) {
    return this.userService.updateBuyDeposit(req.user._id, 0);
  }
}

import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.model';
import { UpdateUserDto } from './dto/createUserDto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async get(username: string) {
    return await this.userModel.findOne({ username });
  }

  async getById(userId: string) {
    return await this.userModel.findOne({ _id: userId });
  }

  async create(createUserDto) {
    const existingUser = await this.userModel.findOne({
      username: createUserDto.username,
    });

    if (existingUser) {
      throw new NotAcceptableException(
        'User with this username already exists!',
      );
    }
    return this.userModel.create(createUserDto);
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: userId },
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async updateDeposit(username: string, updateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { $and: [{ _id: username }, { role: 'buyer' }] },
      { $set: updateUserDto },
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('Please update your role to buyer');
    }

    return updatedUser;
  }

  async updateBuyDeposit(userId: string, userDeopsite): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { deposit: userDeopsite } },
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('Please update your role to buyer');
    }

    return updatedUser;
  }

  async delete(username: string) {
    const deletedUser = await this.userModel.deleteOne({ username });
    if (deletedUser) {
      return 'User removed';
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ _id: id }).exec();
      return user;
    } catch (error) {
      return null;
    }
  }
}

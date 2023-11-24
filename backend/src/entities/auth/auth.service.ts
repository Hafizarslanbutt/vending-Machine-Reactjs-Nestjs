import { Injectable, NotAcceptableException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from '../users/schema/users.model';
import { UsersService } from '../users/users.service';
import { Login } from 'src/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string) {
    const user = await this.userService.get(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<Login> {
    const { _doc, ...result } = user;
    const payload = { sub: _doc._id };

    return {
      user: _doc,
      accesstoken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      accesstoken: this.jwtService.sign(payload),
    };
  }
}

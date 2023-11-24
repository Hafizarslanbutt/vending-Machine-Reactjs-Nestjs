import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import config from '../../../config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema/users.model';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    RefreshJwtStrategy,
    LocalStrategy,
  ],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    ConfigModule.forRoot({ load: [config] }),
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: config().SECRET,
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './entities/auth/auth.module';

import configuration from '../config/configuration';
import { validate } from '../config/env.validation';
import { UsersService } from './entities/users/users.service';
import { UsersModule } from './entities/users/users.module';
import config from '../config/configuration';
import { ProductModule } from './entities/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
      load: [configuration],
    }),
    MongooseModule.forRoot(config().MONGO_URL),
    AuthModule,
    UsersModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}

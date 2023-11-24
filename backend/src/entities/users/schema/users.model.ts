import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: false, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  deposit: number;

  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

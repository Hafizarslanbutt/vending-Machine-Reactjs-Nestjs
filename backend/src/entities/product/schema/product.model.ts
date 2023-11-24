import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  amountAvailable: number;

  @Prop()
  cost: number;

  @Prop()
  productName: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  sellerId: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

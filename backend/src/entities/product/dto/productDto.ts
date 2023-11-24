import { IsNumber, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsString()
  sellerId: string;

  @IsString()
  productName: string;

  @IsNumber()
  amountAvailable: number;

  @IsNumber()
  cost: number;
}

export class UpdateProduct {
  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsNumber()
  amountAvailable: number;

  @IsNumber()
  cost: number;
}

export class ProductBuy {
  @IsString()
  productId: string;

  @IsNumber()
  amount: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

import {
  Controller,
  Get,
  UseGuards,
  Request,
  Body,
  Delete,
  Put,
  Post,
  Param,
} from '@nestjs/common';
import { JwtGuard } from '../auth/gurads/jwt-auth.guard';
import { ProductService } from './product.service';
import { ProductBuy, UpdateProduct, UpdateProductDto } from './dto/productDto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getUsers() {
    return this.productService.get();
  }

  @UseGuards(JwtGuard)
  @Post('add')
  createProduct(@Body() updateProductDto: UpdateProductDto, @Request() req) {
    return this.productService.create(req.user._id, updateProductDto);
  }

  @UseGuards(JwtGuard)
  @Put('update')
  updateProduct(@Body() updateProduct: UpdateProduct, @Request() req) {
    return this.productService.update(req.user._id, updateProduct);
  }

  @UseGuards(JwtGuard)
  @Delete('remove/:id')
  deleteProduct(@Param('id') id: string, @Request() req) {
    return this.productService.delete(req.user._id, id);
  }

  @UseGuards(JwtGuard)
  @Post('buy')
  buyProduct(@Body() productBuy: ProductBuy, @Request() req) {
    return this.productService.buyProduct(req.user._id, productBuy);
  }
}

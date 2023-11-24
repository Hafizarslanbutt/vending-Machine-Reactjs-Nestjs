import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.model';
import { Model } from 'mongoose';
import { ProductBuy, UpdateProduct, UpdateProductDto } from './dto/productDto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly userService: UsersService,
  ) {}

  async get() {
    return await this.productModel.find();
  }

  async create(sellerId: string, updateProductDto: UpdateProductDto) {
    updateProductDto.sellerId = sellerId;
    return this.productModel.create(updateProductDto);
  }

  async update(username: string, updateProduct: UpdateProduct) {
    const updatedProduct = await this.productModel.findOneAndUpdate(
      {
        $and: [{ _id: updateProduct.productId }, { sellerId: username }],
      },
      updateProduct,
      { new: true },
    );
    if (!updatedProduct) {
      throw new NotFoundException('Product not updated');
    }

    return updatedProduct;
  }

  async updateAmount(productId, product) {
    const updatedProduct = await this.productModel.findOneAndUpdate(
      {
        _id: productId,
      },
      product,
      { new: true },
    );
    if (!updatedProduct) {
      throw new NotFoundException('Product not updated');
    }

    return updatedProduct;
  }

  async delete(userId: string, productId: string) {
    const deletedUser = await this.productModel.findOneAndDelete({
      $and: [{ _id: productId }, { sellerId: userId }],
    });

    if (!deletedUser) {
      throw new NotFoundException('Product not deleted');
    }
    return 'Product removed';
  }

  async buyProduct(userId: string, productBuy: ProductBuy) {
    const user = await this.userService.getById(userId);
    if (user.role === 'buyer') {
      const buyingProduct = await this.productModel.findOne({
        _id: productBuy.productId,
      });

      const cost = buyingProduct.cost;
      const productName = buyingProduct.productName;
      const totalSpent = cost * productBuy.amount;
      if (buyingProduct.amountAvailable >= productBuy.amount) {
        if (user.deposit >= totalSpent) {
          const remainingProducts =
            buyingProduct.amountAvailable - productBuy.amount;
          const userDeposit = user.deposit - totalSpent;
          await this.userService.updateBuyDeposit(user._id, userDeposit);
          await this.updateAmount(buyingProduct._id, {
            amountAvailable: remainingProducts,
          });
          return { productName: productName, balance: userDeposit };
        } else {
          throw new NotFoundException(
            'low balance please add deposit to account',
          );
        }
      } else {
        throw new NotFoundException('Required amount not available');
      }
    } else {
      throw new NotFoundException('You have not premission to buy product');
    }
  }
}

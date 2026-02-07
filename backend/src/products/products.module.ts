import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AdminProductsController, ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController, AdminProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AdminCategoriesController, CategoriesController } from './categories.controller';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController, AdminCategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}

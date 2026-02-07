import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AdminOrdersController, OrdersController } from './orders.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [OrdersService],
  controllers: [OrdersController, AdminOrdersController],
})
export class OrdersModule {}

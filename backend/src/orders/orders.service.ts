import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { MailService } from '../mail/mail.service';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService, private readonly mailService: MailService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const uniqueIds = Array.from(new Set(dto.items.map((i) => i.productId)));
    const products = await this.prisma.product.findMany({ where: { id: { in: uniqueIds }, isActive: true } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const itemsWithPrices = dto.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new BadRequestException('One or more products are unavailable');
      return {
        ...item,
        price: product.price,
        name: product.name,
      };
    });

    const computedTotal = itemsWithPrices.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await this.prisma.order.create({
      data: {
        userId,
        items: itemsWithPrices,
        total: computedTotal,
      },
    });

    await this.mailService.sendOrderEmails({
      userEmail: user.email,
      orderId: order.id,
      items: itemsWithPrices,
      total: computedTotal,
    });

    // clear cart silently
    await this.prisma.cart.upsert({
      where: { userId },
      update: { items: [] },
      create: { userId, items: [] },
    });

    return order;
  }

  listAdmin() {
    return this.prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const existing = await this.prisma.order.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Order not found');

    return this.prisma.order.update({ where: { id }, data: { status: dto.status } });
  }
}

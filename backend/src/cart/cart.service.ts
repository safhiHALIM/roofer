import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    return cart ?? { items: [] };
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const product = await this.prisma.product.findFirst({ where: { id: dto.productId, isActive: true } });
    if (!product) throw new NotFoundException('Product not found or inactive');

    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    const items = Array.isArray(cart?.items) ? [...(cart?.items as any[])] : [];
    const index = items.findIndex((item) => item.productId === dto.productId);
    const payload = { ...dto, price: product.price, name: product.name };
    if (index >= 0) {
      items[index] = { ...items[index], quantity: items[index].quantity + dto.quantity, price: product.price, name: product.name };
    } else {
      items.push(payload);
    }

    const updated = await this.prisma.cart.upsert({
      where: { userId },
      update: { items },
      create: { userId, items },
    });

    return updated;
  }

  async updateCart(userId: string, dto: UpdateCartDto) {
    const updated = await this.prisma.cart.upsert({
      where: { userId },
      update: { items: dto.items },
      create: { userId, items: dto.items },
    });
    return updated;
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');
    const items = Array.isArray(cart.items) ? (cart.items as any[]) : [];
    const filtered = items.filter((item) => item.productId !== productId);

    const updated = await this.prisma.cart.update({ where: { userId }, data: { items: filtered } });
    return updated;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async toggle(userId: string, dto: ToggleFavoriteDto) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId: dto.productId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { userId_productId: { userId, productId: dto.productId } } });
      return { favorite: false };
    }

    await this.prisma.favorite.create({ data: { userId, productId: dto.productId } });
    return { favorite: true };
  }

  list(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { product: true },
    });
  }
}

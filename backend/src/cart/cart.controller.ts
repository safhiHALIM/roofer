import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '../guards/email-verified.guard';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard, EmailVerifiedGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.userId || req.user.sub);
  }

  @Post('add')
  add(@Req() req: any, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user.userId || req.user.sub, dto);
  }

  @Put('update')
  update(@Req() req: any, @Body() dto: UpdateCartDto) {
    return this.cartService.updateCart(req.user.userId || req.user.sub, dto);
  }

  @Delete('remove')
  remove(@Req() req: any, @Body() dto: RemoveCartItemDto) {
    return this.cartService.removeItem(req.user.userId || req.user.sub, dto.productId);
  }
}

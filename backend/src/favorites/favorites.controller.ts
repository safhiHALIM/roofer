import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '../guards/email-verified.guard';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';

@Controller('favorites')
@UseGuards(JwtAuthGuard, EmailVerifiedGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('toggle')
  toggle(@Req() req: any, @Body() dto: ToggleFavoriteDto) {
    return this.favoritesService.toggle(req.user.userId || req.user.sub, dto);
  }

  @Get()
  list(@Req() req: any) {
    return this.favoritesService.list(req.user.userId || req.user.sub);
  }
}

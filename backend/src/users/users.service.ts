import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { Role } from '@prisma/client';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  list() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const data: Record<string, any> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.phone !== undefined) data.phone = dto.phone === null ? null : dto.phone;

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return updated;
  }

  async adminUpdate(id: string, dto: UpdateUserAdminDto) {
    const data: Record<string, any> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.phone !== undefined) data.phone = dto.phone === null ? null : dto.phone;
    if (dto.role !== undefined) data.role = dto.role as Role;
    if (dto.emailVerified !== undefined) data.emailVerified = dto.emailVerified;

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    }).catch(() => {
      throw new NotFoundException('Utilisateur introuvable');
    });

    return updated;
  }

  async requestEmailChange(userId: string, dto: ChangeEmailDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.newEmail } });
    if (existing && existing.id !== userId) {
      throw new BadRequestException('Email déjà utilisé');
    }

    const token = randomBytes(32).toString('hex');
    const frontendUrl = this.config.get<string>('FRONTEND_URL');

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        pendingEmail: dto.newEmail,
        verificationToken: token,
      },
    });

    await this.mailService.sendVerificationEmail(dto.newEmail, token, frontendUrl);

    return { message: 'Un email de confirmation a été envoyé à la nouvelle adresse.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const ok = await bcrypt.compare(dto.currentPassword, user.password);
    if (!ok) throw new BadRequestException('Mot de passe actuel incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { message: 'Mot de passe mis à jour' };
  }
}

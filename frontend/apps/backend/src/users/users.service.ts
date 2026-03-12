import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export type User = {
    id: string;
    email: string;
    password: string;
    name: string;
};

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async create(user: Omit<User, 'id'>): Promise<User> {
        return this.prisma.user.create({
            data: user,
        });
    }

    async updateProfile(id: string, data: { name?: string; email?: string }): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this.findById(id);
        if (!user) throw new NotFoundException('User not found');

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) throw new UnauthorizedException('Mot de passe actuel incorrect');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }
}


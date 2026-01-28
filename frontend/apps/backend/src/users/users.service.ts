import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

    async create(user: Omit<User, 'id'>): Promise<User> {
        return this.prisma.user.create({
            data: user,
        });
    }
}

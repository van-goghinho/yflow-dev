import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email, name: user.name };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: { email: user.email, name: user.name }
        };
    }

    async signUp(email: string, pass: string, name: string): Promise<any> {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailRegex.test(email)) {
            throw new BadRequestException('Adresse email invalide');
        }
        if (!pass || pass.length < 8) {
            throw new BadRequestException('Le mot de passe doit contenir au moins 8 caractères');
        }
        if (!name || name.trim().length < 2) {
            throw new BadRequestException('Le nom doit contenir au moins 2 caractères');
        }

        const existingUser = await this.usersService.findOne(email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        const newUser = await this.usersService.create({ email, password: hashedPassword, name });

        return {
            message: 'User created successfully',
            userId: newUser.id
        };
    }
}

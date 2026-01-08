import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

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

        // In real app, use bcrypt.compare here
        if (user.password !== pass) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email, name: user.name };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: { email: user.email, name: user.name }
        };
    }

    async signUp(email: string, pass: string, name: string): Promise<any> {
        const existingUser = await this.usersService.findOne(email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        // In real app, increment salt and hash password here
        const newUser = await this.usersService.create({ email, password: pass, name });

        return {
            message: 'User created successfully',
            userId: newUser.id
        };
    }
}

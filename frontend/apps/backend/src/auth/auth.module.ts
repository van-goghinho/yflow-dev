import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'SECRET_KEY_DEV_ONLY', // TODO: Move to .env
            signOptions: { expiresIn: '2h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule { }

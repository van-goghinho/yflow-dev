import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    async getMe(@Request() req: any) {
        const user = await this.usersService.findById(req.user.sub);
        if (!user) return null;
        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    @Put('me')
    async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
        const updated = await this.usersService.updateProfile(req.user.sub, dto);
        const { password: _, ...safeUser } = updated;
        return safeUser;
    }

    @Put('me/password')
    async updatePassword(@Request() req: any, @Body() dto: UpdatePasswordDto) {
        await this.usersService.updatePassword(req.user.sub, dto.currentPassword, dto.newPassword);
        return { message: 'Mot de passe mis à jour avec succès' };
    }
}

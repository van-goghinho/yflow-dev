import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
    @ApiResponse({ status: 200, description: 'Profil utilisateur' })
    async getMe(@Request() req: any) {
        const user = await this.usersService.findById(req.user.sub);
        if (!user) return null;
        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    @Put('me')
    @ApiOperation({ summary: 'Mettre à jour le profil de l\'utilisateur connecté' })
    @ApiResponse({ status: 200, description: 'Profil mis à jour' })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
        const updated = await this.usersService.updateProfile(req.user.sub, dto);
        const { password: _, ...safeUser } = updated;
        return safeUser;
    }

    @Put('me/password')
    @ApiOperation({ summary: 'Changer le mot de passe de l\'utilisateur connecté' })
    @ApiResponse({ status: 200, description: 'Mot de passe mis à jour' })
    @ApiResponse({ status: 401, description: 'Mot de passe actuel incorrect' })
    async updatePassword(@Request() req: any, @Body() dto: UpdatePasswordDto) {
        await this.usersService.updatePassword(req.user.sub, dto.currentPassword, dto.newPassword);
        return { message: 'Mot de passe mis à jour avec succès' };
    }
}

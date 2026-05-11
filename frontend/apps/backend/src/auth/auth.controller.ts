import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Authentifier un utilisateur et retourner un JWT' })
    @ApiResponse({ status: 200, description: 'Connexion réussie' })
    @ApiResponse({ status: 401, description: 'Identifiants invalides' })
    signIn(@Body() dto: LoginDto) {
        return this.authService.signIn(dto.email, dto.password);
    }

    @Post('register')
    @ApiOperation({ summary: 'Créer un nouveau compte utilisateur' })
    @ApiResponse({ status: 201, description: 'Compte créé' })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
    signUp(@Body() dto: SignupDto) {
        return this.authService.signUp(dto.email, dto.password, dto.name);
    }
}

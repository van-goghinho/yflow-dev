import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('workflows')
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  // Route publique — DOIT être avant les routes :id pour éviter que "public" soit interprété comme un id
  @Get('public')
  @ApiOperation({ summary: 'Lister les workflows publics (galerie)' })
  @ApiResponse({ status: 200, description: 'Liste des workflows publics' })
  findPublic() {
    return this.workflowsService.findPublic();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Créer un nouveau workflow' })
  @ApiResponse({ status: 201, description: 'Workflow créé' })
  create(@Request() req: any, @Body() createWorkflowDto: CreateWorkflowDto) {
    const userId = req.user.sub;
    return this.workflowsService.create(userId, createWorkflowDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Lister les workflows de l\'utilisateur connecté' })
  findAll(@Request() req: any) {
    const userId = req.user.sub;
    return this.workflowsService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un workflow par id (propriétaire uniquement)' })
  @ApiResponse({ status: 404, description: 'Workflow introuvable' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.workflowsService.findOne(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un workflow (propriétaire uniquement)' })
  update(@Request() req: any, @Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto) {
    return this.workflowsService.update(id, req.user.sub, updateWorkflowDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un workflow (propriétaire uniquement)' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.workflowsService.remove(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/run')
  @ApiOperation({ summary: 'Exécuter un workflow via son webhook n8n (propriétaire ou public)' })
  @ApiResponse({ status: 200, description: 'Résultat de l\'exécution' })
  @ApiResponse({ status: 404, description: 'Workflow introuvable ou inaccessible' })
  run(@Request() req: any, @Param('id') id: string, @Body() inputs: Record<string, any>) {
    return this.workflowsService.run(id, req.user.sub, inputs);
  }
}

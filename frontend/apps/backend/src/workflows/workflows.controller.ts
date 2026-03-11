import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  create(@Request() req: any, @Body() createWorkflowDto: CreateWorkflowDto) {
    const userId = req.user.sub;
    return this.workflowsService.create(userId, createWorkflowDto);
  }

  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.sub;
    return this.workflowsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto) {
    return this.workflowsService.update(id, updateWorkflowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowsService.remove(id);
  }

  @Post(':id/run')
  run(@Param('id') id: string) {
    return this.workflowsService.run(id);
  }
}

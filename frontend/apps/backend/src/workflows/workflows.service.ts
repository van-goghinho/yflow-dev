import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { N8nService } from '../n8n/n8n.service';

@Injectable()
export class WorkflowsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly n8nService: N8nService,
  ) {}

  async create(userId: string, createWorkflowDto: CreateWorkflowDto) {
    return this.prisma.workflow.create({
      data: {
        name: createWorkflowDto.name,
        definition: createWorkflowDto.definition,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    // Return all workflows for now, will filter by user when auth is fully setup
    // For now we just return all workflows since auth might not be fully functional yet
    // return this.prisma.workflow.findMany({ where: { userId } });
    return this.prisma.workflow.findMany({
      where: userId ? { userId } : undefined,
    });
  }

  async findOne(id: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
    });
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }
    return workflow;
  }

  async update(id: string, updateWorkflowDto: UpdateWorkflowDto) {
    await this.findOne(id); // Check existence
    return this.prisma.workflow.update({
      where: { id },
      data: {
        name: updateWorkflowDto.name,
        definition: updateWorkflowDto.definition,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence
    return this.prisma.workflow.delete({
      where: { id },
    });
  }

  async run(id: string) {
    const workflow = await this.findOne(id);
    
    // Call n8n logic
    // We assume the workflow id is also the webhook id or we just trigger the generic webhook endpoint
    const n8nResponse = await this.n8nService.executeWebhook(id, {
      workflowId: id,
      name: workflow.name,
      triggerTime: new Date().toISOString()
    });

    return {
      message: 'Workflow execution triggered via n8n',
      workflowId: workflow.id,
      n8nResponse,
    };
  }
}

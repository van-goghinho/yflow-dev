import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(private readonly prisma: PrismaService) {}

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
    // TODO: Call n8n API to trigger workflow
    return {
      message: 'Workflow execution triggered (mock)',
      workflowId: workflow.id,
      status: 'pending'
    };
  }
}

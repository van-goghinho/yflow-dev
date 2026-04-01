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
    return this.prisma.workflow.findMany({
      where: { userId },
    });
  }

  async findPublic() {
    return this.prisma.workflow.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        webhookPath: true,
        definition: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
    });
    if (!workflow) {
      throw new NotFoundException(`Workflow introuvable`);
    }
    return workflow;
  }

  async update(id: string, updateWorkflowDto: UpdateWorkflowDto) {
    await this.findOne(id);
    return this.prisma.workflow.update({
      where: { id },
      data: {
        name: updateWorkflowDto.name,
        definition: updateWorkflowDto.definition,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.workflow.delete({
      where: { id },
    });
  }

  async run(id: string, inputs: Record<string, any>) {
    const workflow = await this.findOne(id);

    if (!workflow.webhookPath) {
      throw new NotFoundException("Ce workflow n'a pas de webhook configuré");
    }

    const n8nResponse = await this.n8nService.executeWebhook(workflow.webhookPath, inputs);

    return {
      message: 'Workflow exécuté avec succès',
      workflowId: workflow.id,
      result: Array.isArray(n8nResponse) ? n8nResponse[0]?.result : n8nResponse?.result,
    };
  }
}

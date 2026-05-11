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

  async create(userId: string, dto: CreateWorkflowDto) {
    return this.prisma.workflow.create({
      data: {
        name: dto.name,
        definition: dto.definition,
        description: dto.description,
        category: dto.category,
        webhookPath: dto.webhookPath,
        isPublic: dto.isPublic ?? false,
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

  async findOne(id: string, userId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { id, userId },
    });
    if (!workflow) {
      throw new NotFoundException('Workflow introuvable');
    }
    return workflow;
  }

  async update(id: string, userId: string, dto: UpdateWorkflowDto) {
    await this.findOne(id, userId);
    return this.prisma.workflow.update({
      where: { id },
      data: {
        name: dto.name,
        definition: dto.definition,
        description: dto.description,
        category: dto.category,
        webhookPath: dto.webhookPath,
        isPublic: dto.isPublic,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.workflow.delete({
      where: { id },
    });
  }

  async run(id: string, userId: string, inputs: Record<string, any>) {
    const workflow = await this.prisma.workflow.findFirst({
      where: {
        id,
        OR: [{ userId }, { isPublic: true }],
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow introuvable');
    }

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

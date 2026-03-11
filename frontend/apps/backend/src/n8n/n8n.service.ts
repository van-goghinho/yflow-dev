import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = this.configService.get<string>('N8N_API_URL') || 'http://localhost:5678';
    this.apiKey = this.configService.get<string>('N8N_API_KEY') || '';
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': this.apiKey,
    };
  }

  async listWorkflows() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/api/v1/workflows`, { headers: this.headers })
      );
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to list n8n workflows', error.message);
      throw error;
    }
  }

  async getWorkflow(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/api/v1/workflows/${id}`, { headers: this.headers })
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to get n8n workflow ${id}`, error.message);
      throw error;
    }
  }

  async createWorkflow(data: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/api/v1/workflows`, data, { headers: this.headers })
      );
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to create n8n workflow', error.message);
      throw error;
    }
  }

  async activateWorkflow(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/api/v1/workflows/${id}/activate`, {}, { headers: this.headers })
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to activate n8n workflow ${id}`, error.message);
      throw error;
    }
  }

  async deactivateWorkflow(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/api/v1/workflows/${id}/deactivate`, {}, { headers: this.headers })
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to deactivate n8n workflow ${id}`, error.message);
      throw error;
    }
  }

  async executeWebhook(webhookId: string, data: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/webhook/${webhookId}`, data, { headers: this.headers })
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to execute n8n webhook ${webhookId}`, error.message);
      throw error;
    }
  }
}

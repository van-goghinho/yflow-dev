import { registerAs } from '@nestjs/config';

export default registerAs('n8n', () => ({
  apiUrl: process.env.N8N_API_URL || 'http://localhost:5678',
  apiKey: process.env.N8N_API_KEY,
}));

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { N8nModule } from './n8n/n8n.module';
import { ConfigModule } from '@nestjs/config';
import n8nConfig from './n8n/n8n.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [n8nConfig] }),
    PrismaModule, 
    AuthModule, 
    UsersModule, 
    WorkflowsModule,
    N8nModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

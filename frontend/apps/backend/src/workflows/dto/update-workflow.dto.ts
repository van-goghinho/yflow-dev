import { CreateWorkflowDto } from './create-workflow.dto';

export class UpdateWorkflowDto implements Partial<CreateWorkflowDto> {
  name?: string;
  definition?: any;
}

import { Alert } from '@src/entities/Alert';
import { BaseService } from '@lib/BaseClasses/BaseService';

export class AlertSvc extends BaseService<Alert> {}

export const alertSvc = new AlertSvc(Alert);

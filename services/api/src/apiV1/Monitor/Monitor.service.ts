import { Monitor } from '@src/entities/Monitor';
import { BaseService } from '@lib/BaseClasses/BaseService';

export class MonitorSvc extends BaseService<Monitor> {}

export const monitorSvc = new MonitorSvc(Monitor);

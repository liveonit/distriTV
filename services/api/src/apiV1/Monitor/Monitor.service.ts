import { Monitor } from 'validation/entities/Monitor';
import { BaseService } from 'lib/BaseClasses/BaseService';
import { db } from '@src/db';

export class MonitorSvc extends BaseService<Monitor> {}

export const monitorSvc = new MonitorSvc(Monitor, db);

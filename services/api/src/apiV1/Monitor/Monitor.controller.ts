import { Monitor } from '@src/entities/Monitor';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { MonitorSvc, monitorSvc } from './Monitor.service';
import { createMonitorBody } from './types/CreateMonitorBody';
import { updateMonitorBody } from './types/UpdateMonitorBody';


class MonitorController extends BaseController<Monitor, MonitorSvc> { }

export const alertController = new MonitorController(
  monitorSvc,
  createMonitorBody,
  updateMonitorBody,
  undefined,
  querySchema,
);

import { Monitor } from 'validation/entities/Monitor';
import { BaseController } from 'lib/BaseClasses/BaseController';
import { querySchema } from 'lib/BaseClasses/QueryType';
import { MonitorSvc, monitorSvc } from './Monitor.service';
import { createMonitorBody } from 'validation/entities';
import { updateMonitorBody } from 'validation/entities';


class MonitorController extends BaseController<Monitor, MonitorSvc> { }

export const alertController = new MonitorController(
  monitorSvc,
  createMonitorBody,
  updateMonitorBody,
  undefined,
  querySchema,
);

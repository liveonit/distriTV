import { Schedule } from '@src/entities/Schedule';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { ScheduleSvc, scheduleSvc } from './Schedule.service';
import { createScheduleBody } from './types/CreateScheduleBody';
import { updateScheduleBody } from './types/UpdateScheduleBody';

class ScheduleController extends BaseController<Schedule, ScheduleSvc> { }

export const scheduleController = new ScheduleController(
  scheduleSvc,
  createScheduleBody,
  updateScheduleBody,
  undefined,
  querySchema,
);

import { Schedule } from '@src/entities/Schedule';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { ScheduleSvc, scheduleSvc } from './Schedule.service';
import { createScheduleBody } from 'validation/src/Agenda/CreateScheduleBody';
import { updateScheduleBody } from 'validation/src/Agenda/UpdateScheduleBody';
import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { Request, Response } from 'express';


class ScheduleController extends BaseController<Schedule, ScheduleSvc> { 
  public override create = handleErrorAsync(async (req: Request, res: Response) => {
      return res.status(200).json(await this.service.createSchedule(req.body));
  });
}

export const scheduleController = new ScheduleController(
  scheduleSvc,
  createScheduleBody,
  updateScheduleBody,
  undefined,
  querySchema,
);

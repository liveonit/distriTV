import { Schedule } from "@src/entities/Schedule";
import BaseController from "@src/utils/BaseClasses/BaseController";
import { querySchema } from "@src/utils/BaseClasses/QueryType";
import { ScheduleSvc, scheduleSvc } from "./Schedule.service";
import { createScheduleBody } from "./types/CreateScheduleBody";
import { updateScheduleBody } from "./types/UpdateScheduleBody";
import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { BadRequest } from '@src/utils/errors';
import { Request, Response } from 'express';

class ScheduleController extends BaseController<Schedule, ScheduleSvc> {
    public getByTVcode = handleErrorAsync(async (req: Request, res: Response) => {
        let tvCode: string = req.params.id
        let results = await this.service.getEntity().createQueryBuilder()
            .leftJoinAndSelect("Schedule.television", "Television")
            .leftJoinAndSelect("Schedule.content", "Content")
            .where("Television.tvCode = :tvCode", {tvCode})          
            .getMany()            
        return res.status(200).json(results);
    });
}

export const scheduleController = new ScheduleController(scheduleSvc, createScheduleBody, updateScheduleBody, undefined, querySchema)

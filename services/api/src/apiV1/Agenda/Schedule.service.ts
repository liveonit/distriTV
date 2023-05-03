import { Schedule } from '@src/entities/Schedule';
import { BaseService } from '@src/utils/BaseClasses/BaseService';


export class ScheduleSvc extends BaseService<Schedule> {

}

export const scheduleSvc = new ScheduleSvc(Schedule);



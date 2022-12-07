import { Agenda } from '@src/entities/Agenda';
import { BaseService } from '@src/utils/BaseClasses/BaseService';


export class AgendaSvc extends BaseService<Agenda> {}

export const agendaSvc = new AgendaSvc(Agenda);



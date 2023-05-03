import { Television } from '@src/entities/Television';
import { BaseService } from '@src/utils/BaseClasses/BaseService';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

export class TelevisionSvc extends BaseService<Television> {
    public getByTVcode = async (tvCode: string) => {
        return Television.find({relations: ['schedules', 'schedules.content'], where: {tvCode}})
    };
}

export const televisionSvc = new TelevisionSvc(Television);

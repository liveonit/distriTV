import { Television } from '@src/entities/Television';
import { BaseService } from '@lib/BaseClasses/BaseService';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { length } from 'class-validator';
import { Alert } from '@src/entities/Alert';

export class TelevisionSvc extends BaseService<Television> {
    public getByTVcode = async (tvCode: string, durationLeft: number) => {
        return Television.find({relations: ['schedules', 'schedules.content', 'alerts'], where: {tvCode}}).then(televisions => {
            let result = JSON.parse(JSON.stringify(televisions[0]))
            if (result.alerts.length > 0) {                
                if(durationLeft === 0){
                    Alert.delete({id: result.alerts[0].id})
                    result.alert = null
                } else {
                    result.alert = result.alerts[0]
                    result.alert.durationLeft = durationLeft || result.alert.duration
                }
                
                
            }
            delete result.alerts
            return result
        })
    };
}

export const televisionSvc = new TelevisionSvc(Television);

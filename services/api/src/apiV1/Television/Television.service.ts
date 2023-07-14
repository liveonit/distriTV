import { Television } from '@src/entities/Television';
import { BaseService } from '@lib/BaseClasses/BaseService';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { length } from 'class-validator';
import { Alert } from '@src/entities/Alert';
import { Schedule } from '@src/entities/Schedule';

export class TelevisionSvc extends BaseService<Television> {
    public getByTVcode = async (tvCode: string, durationLeft: number) => {
        return Television.find({relations: ['schedules', 'schedules.content', 'alerts', 'labels'], where: {tvCode}}).then(televisions => {
            let result = JSON.parse(JSON.stringify(televisions[0]))
            
            // Handle alerts
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

            // Handle schedules associated to label            
            return Promise.all(televisions[0].labels?.map(label => {
                return Schedule.find({where: {labelId: label.id}})
            })!).then(schedules => schedules.flat()).then(flattenSchedules => {
                result.schedules = result.schedules.concat(flattenSchedules)
                return result
            })        
        })
    };
}

export const televisionSvc = new TelevisionSvc(Television);

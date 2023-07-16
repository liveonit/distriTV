import { Television } from '@src/entities/Television';
import { BaseService } from '@lib/BaseClasses/BaseService';
import { Alert } from '@src/entities/Alert';
import { Schedule } from '@src/entities/Schedule';

export class TelevisionSvc extends BaseService<Television> {
    public getByTVcode = async (tvCode: string, durationLeft: number) => {
        return Television.find({relations: ['schedules', 'schedules.content', 'alert', 'labels'], where: {tvCode}}).then(televisions => {
            let result = JSON.parse(JSON.stringify(televisions[0]))
            
            // Handle alerts
            if (result.alert !== null) {                
                if(durationLeft === 0){
                    Alert.delete({id: result.alert.id})
                    result.alert = null
                } else {
                    result.alert.durationLeft = durationLeft || result.alert.durationLeft || result.alert.duration
                    Alert.update({id: result.alert.id}, {durationLeft })
                }                               
            }

            // Handle schedules associated to label            
            return Promise.all(televisions[0].labels?.map(label => {
                return Schedule.find({relations: ['content'], where: {labelId: label.id}})
            })!).then(schedules => {
                result.schedules = result.schedules.concat(schedules.flat())
                return result
            })
        })
    };
}

export const televisionSvc = new TelevisionSvc(Television);

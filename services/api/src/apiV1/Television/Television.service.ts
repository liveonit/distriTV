import { Television } from '@src/entities/Television';
import { BaseService } from '@lib/BaseClasses/BaseService';
import { Alert } from '@src/entities/Alert';
import { Schedule } from '@src/entities/Schedule';

export class TelevisionSvc extends BaseService<Television> {
    public getByTVcode = async (tvCode: string, durationLeft: number) => {
        return Television.findOne({relations: ['schedules', 'schedules.content', 'alert', 'labels'], where: {tvCode}}).then(async television => {
            if(!television)
                throw new Error('TV code not found')
            
            // Handle alerts
            if (television.alert !== null) {             
                if(durationLeft === 0){
                    await Alert.delete({id: television.alert!.id})
                    television.alert = null
                } else {
                    if (!television.alert?.started) {
                        television.alert!.durationLeft = television.alert!.duration
                    }
                    else {
                        television.alert!.durationLeft = durationLeft || television.alert!.durationLeft
                    }
                    await Alert.update({id: television.alert!.id}, {durationLeft: television.alert!.durationLeft, started: true })
                }                               
            }

            // Handle schedules associated to label            
            return Promise.all(television.labels?.map(label => {
                return Schedule.find({relations: ['content'], where: {labelId: label.id}})
            })!).then(schedules => {
                television.schedules = television.schedules!.concat(schedules.flat())
                return television
            })
        })
    };
}

export const televisionSvc = new TelevisionSvc(Television);

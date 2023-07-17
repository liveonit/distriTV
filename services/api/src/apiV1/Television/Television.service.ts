import { Television } from '@src/entities/Television';
import { BaseService } from '@lib/BaseClasses/BaseService';
import { Alert } from '@src/entities/Alert';
import { Monitor } from '@src/entities/Monitor';
import { Schedule } from '@src/entities/Schedule';
import { MonitorSvc } from '../Monitor/Monitor.service';

export class TelevisionSvc extends BaseService<Television> {

    public createTelevisionWithMonitor = async (body: any) => {
        return this.create(body, {relations: ['labels', 'institution', 'monitor']}).then(tv => {
            const yo = new MonitorSvc(Monitor)
            return yo.create(Monitor.create({})).then(async newMonitor => {                
                await Television.update({id: tv.id}, {monitor: newMonitor})
                tv.monitor = newMonitor       
                return tv
            })
        })            
    };

    public getByTVcode = async (tvCode: string, body: any) => {
        const durationLeft: number = body.alertDurationLeft;

        return Television.findOne({relations: ['schedules', 'schedules.content', 'alert', 'labels', 'monitor'], where: {tvCode}}).then(async television => {
            if(!television)
                throw new Error('TV code not found')
            
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

            // Handle monitoring data
            delete body.alertDurationLeft
            if (Object.keys(body).length !== 0) {
                await Monitor.update({id: television.monitor!.id}, body)
            }            
            delete television.monitor

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

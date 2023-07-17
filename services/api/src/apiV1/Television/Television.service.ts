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
                return tv
            })
        })            
    };

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

      // Handle alerts
      if (television.alert !== null) {
        if (durationLeft === 0) {
          await Alert.delete({ id: television.alert!.id });
          television.alert = null;
        } else {
          if (!television.alert?.started) {
            television.alert!.durationLeft = television.alert!.duration;
          } else {
            television.alert!.durationLeft = durationLeft || television.alert!.durationLeft;
          }
          await Alert.update(
            { id: television.alert!.id },
            { durationLeft: television.alert!.durationLeft, started: true },
          );
        }
      }

      // Handle schedules associated to label
      if (television.labels)
        return Promise.all(
          television.labels.map((label) => {
            return Schedule.find({ relations: ['content'], where: { labelId: label.id } });
          })!,
        ).then((schedules) => {
          television.schedules = television.schedules!.concat(schedules.flat());
          return television;
        });
      else return television;
    });
  };
}

export const televisionSvc = new TelevisionSvc(Television);

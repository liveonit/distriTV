import { Television } from 'validation/entities/Television';
import { BaseService } from 'lib/BaseClasses/BaseService';
import { Alert } from 'validation/entities/Alert';
import { Monitor } from 'validation/entities/Monitor';
import { Schedule } from 'validation/entities/Schedule';
import { MonitorSvc } from '../Monitor/Monitor.service';
import { FindOneOptions } from 'typeorm';
import { db } from '@src/db';

export class TelevisionSvc extends BaseService<Television> {
  public createWithMonitor = async (body: Television, options?: FindOneOptions<Television>) => {
    const monitorSvc = new MonitorSvc(Monitor, this.db);
    const monitor = await monitorSvc.create(Monitor.create({}));
    const tv = await this.create({ ...body, monitor } as Television, options);
    tv.monitor = monitor;
    return tv;
  };

  public getByTVcode = async (tvCode: string, body: any) => {
    const durationLeft: number = body.alertDurationLeft;

    return Television.findOne({
      relations: ['schedules', 'schedules.content', 'alert', 'labels', 'monitor'],
      where: { tvCode },
    }).then(async (television) => {
      if (!television) throw new Error('TV code not found');

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

      // Handle monitoring data
      delete body.alertDurationLeft;
      if (Object.keys(body).length !== 0) {
        await Monitor.update({ id: television.monitor!.id }, body);
      }
      delete television.monitor;

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
      else {
        return television;
      }
    });
  };
}

export const televisionSvc = new TelevisionSvc(Television, db);

import { Alert } from '@src/entities/Alert';
import { BaseService } from '@lib/BaseClasses/BaseService';
import { Label } from '@src/entities/Label';

export class AlertSvc extends BaseService<Alert> {
    public createAlerts = async (body: any) => {
        body.durationLeft = body.duration
        if (body.destinationType === 'TELEVISION') {                     
            return this.create(Alert.create(body), {relations: ['television']}).then(newAlert => [newAlert])
        } else {
            return Label.findOne({where: {'id': body.labelId}, relations: ['tvs']}).then(label => {
                console.log(label)
                const newAlerts = label?.tvs?.map(tv => {
                    body.television = {id: tv.id}
                    return this.create(Alert.create(body), {relations: ['television']})
                })
                return Promise.all(newAlerts!)
            })
        }
    };
}

export const alertSvc = new AlertSvc(Alert);

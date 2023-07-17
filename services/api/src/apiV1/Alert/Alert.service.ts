import { Alert } from '@src/entities/Alert';
import { BaseService } from '@lib/BaseClasses/BaseService';
import { Label } from '@src/entities/Label';
import { Television } from '@src/entities/Television';

export class AlertSvc extends BaseService<Alert> {
    public createAlerts = async (body: any) => {
        body.durationLeft = body.duration
        body.started = false
        if (body.destinationType === 'TELEVISION') {         
            await Television.findOne({where: {id: body.television.id}, relations: ['alert']}).then(async tv => {
                if (tv && tv.alert) {
                    await Alert.delete(tv.alert.id)
                }
            })            
            await this.create(Alert.create(body), {relations: ['television']}).then(newAlert => [newAlert])
        } else {
            await Label.findOne({where: {'id': body.labelId}, relations: ['tvs', 'tvs.alert']}).then(async label => {                
                const newAlerts = label?.tvs?.map(async tv => {
                    if(tv.alert){
                        await Alert.delete(tv.alert.id)
                    }
                    body.television = {id: tv.id}
                    return this.create(Alert.create(body), {relations: ['television']})
                })
                await Promise.all(newAlerts!)
            })
        }
        return Alert.find({relations: ['television', 'label']})
    };
}

export const alertSvc = new AlertSvc(Alert);

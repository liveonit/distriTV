import { Schedule } from '@src/entities/Schedule';
import { BaseService } from '@lib/BaseClasses/BaseService';
import { Television } from '@src/entities/Television';
import { Content } from '@src/entities/Content';
import { ArrayContains } from 'typeorm';
import { Label } from '@src/entities/Label';
import { BadRequest } from '@src/lib/errors/BadRequest';
import { OverlapSchedule } from '@src/lib/errors/OverlapSchedule';
var parser = require('cron-parser');

export class ScheduleSvc extends BaseService<Schedule> {
    public async createSchedule (body: any) {
        // if la crea por television
        if (body.televisionId) {
            await Television.findOne({
                where: {id: body.televisionId},
                relations: ['schedules', 'schedules.content', 'labels']})
            .then(async tv => {
                if (!tv) throw new Error('TV not found')
                let myStartDate = new Date(body.startDate)
                let myEndDate = new Date(body.endDate)

                await Content.findOne({where: {id: body.contentId}}).then(async content => {                    
                    let misSchedules = tv.schedules
                    if(tv.labels)  
                        await Promise.all(tv.labels.map(label => {
                            return Schedule.find({relations: ['content'], where: {labelId: label.id}})
                        })!).then(schedules => {
                            misSchedules = misSchedules!.concat(schedules.flat())                            
                        })

                    let myPeriods = getPeriodsFromCron(myStartDate, new Date(body.endDate), body.id, content!.duration, body.cron, myStartDate, myEndDate)
                    console.log(myPeriods, 'MIS PERIODOS')

                    misSchedules?.forEach(schedule => {
                        let busyPeriods = getPeriodsFromCron(schedule.startDate, schedule.endDate, schedule.id, schedule.content.duration, schedule.cron, myStartDate, myEndDate)
                        busyPeriods.forEach(busyPeriod => {
                            myPeriods.forEach(myPeriod => {
                                if (!(myPeriod.endDate < busyPeriod.startDate || myPeriod.startDate > busyPeriod.endDate)) {
                                    throw new OverlapSchedule(String('Overlaps with ' + busyPeriod.scheduleId));
                                }
                            })
                        })
                    })
                })
                
            })
        } else {
            await Television.find({
                where: {labels: {id: body.labelId}},
                relations: ['schedules', 'schedules.content']
            }).then(async tvs => {
                if(tvs.length > 0) {
                    let myStartDate = new Date(body.startDate)
                    let myEndDate = new Date(body.endDate)

                    await Content.findOne({where: {id: body.contentId}}).then(async content => {     

                        let myPeriods = getPeriodsFromCron(myStartDate, new Date(body.endDate), body.id, content!.duration, body.cron, myStartDate, myEndDate)
                        console.log(myPeriods, 'MIS PERIODOS')

                        let misSchedules: Schedule[] = []
                        tvs.forEach(tv => {
                            misSchedules = misSchedules.concat(tv.schedules ? tv.schedules : [])
                        })

                        const schedulesOfLabel = await Label.findOne({where: {id: body.labelId}}).then(label => 
                            label!.schedules ? label!.schedules : []
                        )

                        misSchedules = misSchedules.concat(schedulesOfLabel)

                        misSchedules?.forEach(schedule => {
                            let busyPeriods = getPeriodsFromCron(schedule.startDate, schedule.endDate, schedule.id, schedule.content.duration, schedule.cron, myStartDate, myEndDate)
                            busyPeriods.forEach(busyPeriod => {
                                myPeriods.forEach(myPeriod => {
                                    if (!(myPeriod.endDate < busyPeriod.startDate || myPeriod.startDate > busyPeriod.endDate)) {
                                        throw new OverlapSchedule(String('Overlaps with ' + busyPeriod.scheduleId));
                                    }
                                })
                            })
                        })
                    })

                }
            })





        }
        



        // else la crea por label


        // este return es si pasa el check
        return this.create(Schedule.create(body), {relations: ['television', 'label', 'content']})
    }
}

export const scheduleSvc = new ScheduleSvc(Schedule);


function getPeriodsFromCron (startDate: Date, endDate: Date, id: number, duration: number, cron: string, myStartDate: Date, myEndDate: Date) {

    if (cron === '0 * * * * ?' && startDate.getTime() === endDate.getTime()) {
        // Es por única vez
        return [
            {
                startDate: startDate,
                endDate: new Date(startDate.getTime() + duration * 1000),
                scheduleId: id
            }
        ]
    } else {
        // Es por cron
        let options = {
            currentDate: startDate.getTime() > myStartDate.getTime() ? startDate : myStartDate,
            endDate: myEndDate.getTime() < endDate.getTime() ? myEndDate : endDate,
            iterator: true
        };
        let myPeriods = []
        try {
            var interval = parser.parseExpression(cron, options);
            
            while (true) {
                console.log(cron, id)
              try {
                var obj = interval.next();
                let periodStartDate = new Date(obj.value.toString())
                myPeriods.push({
                    startDate: periodStartDate,
                    endDate: new Date(periodStartDate.getTime() + duration * 1000),
                    scheduleId: id
                })
              } catch (e) {
                break;
              }
            }
        } catch (err) {
        console.log('Error: ' + err);
        }
        return myPeriods
    }    
}
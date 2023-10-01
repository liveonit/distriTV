import { Schedule } from 'validation/entities/Schedule';
import { BaseService } from 'lib/BaseClasses/BaseService';
import { Television } from 'validation/entities/Television';
import { Content } from 'validation/entities/Content';
import { Label } from 'validation/entities/Label';
import { OverlapSchedule } from 'lib/errors/OverlapSchedule';
import { db } from '@src/db';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require('cron-parser');

export class ScheduleSvc extends BaseService<Schedule> {
    public async createSchedule (body: any) {
        // if la crea por television
        if (body.televisionId) {
            await Television.findOne({
                where: {id: body.televisionId},
                relations: ['schedules', 'schedules.content', 'labels']})
            .then(async tv => {
                if (!tv) throw new Error('TV not found')
                const myStartDate = new Date(body.startDate)
                const myEndDate = new Date(body.endDate)

                await Content.findOne({where: {id: body.contentId}}).then(async content => {
                    let misSchedules = tv.schedules
                    if(tv.labels)
                        await Promise.all(tv.labels.map(label => {
                            return Schedule.find({relations: ['content'], where: {labelId: label.id}})
                        })!).then(schedules => {
                            misSchedules = misSchedules!.concat(schedules.flat())
                        })

                    const myPeriods = getPeriodsFromCron(myStartDate, new Date(body.endDate), body.id, content!.duration, body.cron, myStartDate, myEndDate)
                    console.log(myPeriods, 'MIS PERIODOS')

                    misSchedules?.forEach(schedule => {
                        const busyPeriods = getPeriodsFromCron(schedule.startDate, schedule.endDate, schedule.id, schedule.content.duration, schedule.cron, myStartDate, myEndDate)
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
                    const myStartDate = new Date(body.startDate)
                    const myEndDate = new Date(body.endDate)

                    await Content.findOne({where: {id: body.contentId}}).then(async content => {

                        const myPeriods = getPeriodsFromCron(myStartDate, new Date(body.endDate), body.id, content!.duration, body.cron, myStartDate, myEndDate)
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
                            const busyPeriods = getPeriodsFromCron(schedule.startDate, schedule.endDate, schedule.id, schedule.content.duration, schedule.cron, myStartDate, myEndDate)
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

        return this.create(Schedule.create(body), {relations: ['television', 'label', 'content']})
    }
}

export const scheduleSvc = new ScheduleSvc(Schedule, db);


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
        const options = {
            currentDate: startDate.getTime() > myStartDate.getTime() ? startDate : myStartDate,
            endDate: myEndDate.getTime() < endDate.getTime() ? myEndDate : endDate,
            iterator: true
        };
        const myPeriods = []
        try {
            const interval = parser.parseExpression(cron, options);

            // eslint-disable-next-line no-constant-condition
            while (true) {
                console.log(cron, id)
              try {
                const obj = interval.next();
                const periodStartDate = new Date(obj.value.toString())
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

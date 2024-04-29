import { CronJob } from "cron"
import pino from 'pino';
const log = pino();
const timeZone = 'Etc/GMT-1';

export class BatchService{

    constructor(bot, procedure){
        this.bot = bot
        this.procedure = procedure
        this.batch()
    }

    batch(){
        const job = new CronJob(
            '00 30 12 * * *',
            () => {
                this.procedure()
            },
            null,
            timeZone,
        )
    }

}
import pino from 'pino';
const log = pino();

export class BotController{
    constructor(bot, botservice){
        this.bot = bot;
        this.botservice = botservice;
        this.setupHandlers();
    }

    setupHandlers(){
        // this.bot.onText(/\/echo (.+)/, (msg, match) => {
        //     const chatId = msg.chat.id;
        //     const resp = match[1];
        //     this.bot.sendMessage(chatId, resp);
        // });
            
        this.bot.onText(/\/(start|subscribe)/, async (msg) => {
            log.info(`A new request was made to start/subscribe from ${msg.chat.id}`)
            const chatId = msg.chat.id;
            const respose = await this.botservice.newUser(chatId)
            this.bot.sendMessage(chatId, respose);
        });

        this.bot.onText(/\/unsubscribe/, async (msg) => {
            log.info(`A new request was made to unsubscribe from ${msg.chat.id}`)
            const chatId = msg.chat.id;
            const respose = await this.botservice.unsubscribe(chatId)
            this.bot.sendMessage(chatId, respose);
        });

        this.bot.onText(/\/fact/, async (msg) => {
            log.info(`A new request was made to retrieve an useless fact from ${msg.chat.id}`)
            const chatId = msg.chat.id;
            const respose = await this.botservice.retrieveUselessFact(chatId)
            this.bot.sendMessage(chatId, respose);
        });

    }
}



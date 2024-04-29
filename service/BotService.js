import pino from 'pino';
import axios from 'axios';
const log = pino();

export class BotService{
    constructor(repository, bot){
        this.repository = repository;
        this.bot = bot;
        log.info(repository)
        log.info('The repisory has started')
        log.info('This is its value')
        log.info(this.repository)
    }

    async newUser(userId){
        try{
            const userExist = await this.repository.userExists(userId)
            if(!userExist){
                log.info('inserting the new user...')
                log.info('This is the repository')
                log.info(this.repository)
                this.repository.insertSubscriber(userId)
                const fact = await this.retrieveUselessFact()
                log.info(`A new user with userId ${userId} was inserted`)
                let message = 
                `Congratulations in your new subscription!

Enjoy a welcome useless fact:
${fact}`;
                return message;
            }else{
                log.info('The user already exist')
                return 'You are already registered!'
            }
        }catch(error){
            log.error(error, 'An error was found while trying to insert a new client')
        }
    }

    async retrieveUselessFact(){
    return axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random')
    .then(function (response){
        log.info('The fact was retrieved succesfully')
        return `${response.data.text}

source: ${response.data.source_url}`;
    }).catch(error => {
        log.error(error, 'Failed to retrieve fact');
        return "No fact available right now.";
    })
    }

    async unsubscribe(userId){
        try{
            const userExist = await this.repository.userExists(userId)
            if(userExist){
                this.repository.removeSubscriber(userId)
                return 'You have been succesfully removed from the subscriber list, you will be missed!'
            } else {
                return "You're not subscribed yet, you can't unsubscribe!"
            }
        }catch(error){
            log.error(error, `failed to remove the user`)
        }
    }

    async sendFactsToSubscribers(){
        log.info('Sending facts to subscribers....')
        const subscribers = await this.repository.retrieveSubscribers();
        subscribers.forEach(async subscriber => {
            const uselessFact = await this.retrieveUselessFact();
            this.bot.sendMessage(subscriber.id, uselessFact);
        })
    }
}
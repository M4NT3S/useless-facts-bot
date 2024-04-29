import pino from 'pino';
import { Subscriber } from '../model/Subscriber.js';
import * as fs from 'fs/promises'; // Use fs/promises for Promise-based operations
const log = pino();

export class BotRepository {

    // constructor() {
    //     this.subscribers = this.retrieveSubscribers(); // this now returns a Promise
    //     log.info('This is executed only the first time')
    // }

    async userExists(userId) {
        const subscribers = await this.retrieveSubscribers(); // Wait for the subscribers to be loaded
        return subscribers.some(subscriber => subscriber.id === userId);
    }

    async retrieveSubscribers() {
        try {
            const data = await fs.readFile(process.env.DATA, 'utf8');
            const jsonData = JSON.parse(data);
            if (Array.isArray(jsonData)) {
                return jsonData.map(subscriberData => new Subscriber(subscriberData.id));
            } else {
                log.info("Expected an array of subscribers, received something else.");
                return [];
            }
        } catch (err) {
            log.error(err, 'Failed to read or parse subscribers');
            return [];
        }
    }

    async insertSubscriber(userId){
        let subscribers = await this.retrieveSubscribers();
        subscribers.push(new Subscriber(userId))
        try{
            await fs.writeFile(process.env.DATA, JSON.stringify(subscribers, null, 2), 'utf8');
            log.info('Subscriber added successfully.');
        } catch (error) {
            log.error('Failed to add subscriber:', error);
        }
    }

    async removeSubscriber(userId){
        try{
            let subscribers = await this.retrieveSubscribers();
            const filteredSubscribers = subscribers.filter(sub => sub.id !== userId)
            await fs.writeFile(process.env.DATA, JSON.stringify(filteredSubscribers, null, 2), 'utf8');
            log.info('Subscriber removed successfully.');
        }catch(error){
            log.error('Failed to remove subscriber:', error)
        }
    }
}
import 'dotenv/config'
import TelegramBot from 'node-telegram-bot-api';
import { BotController } from './controller/BotController.js';
import { BotService } from './service/BotService.js';
import { BotRepository } from './repository/BotRepository.js';
import {BatchService} from './service/BatchService.js';
import pino from 'pino';
const log = pino({});

log.info('Starting the bot...')
const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_KEY, {polling:true});
const botRepository = new BotRepository();
log.info('this is the repository value')
log.info(botRepository)
const botservice = new BotService(botRepository);
const botController = new BotController(bot, botservice);
const batchService = new BatchService(bot, botservice.sendFactsToSubscribers);
bot.on("polling_error", console.log);

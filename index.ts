import { Telegraf } from 'telegraf';
import config from './config';

import submit from './command/submit';

import spam from './action/spam';
import ham from './action/ham';

import mSpam from './middleware/spam';

const bot = new Telegraf(config.token);

bot.use(mSpam);

bot.start((ctx: any) => {
  ctx.reply('我能够通过人工整理的黑名单来拦截垃圾消息', { reply_to_message_id: ctx.message.message_id });
});

bot.help((ctx: any) => {
  ctx.reply(`/submit 提交文本消息给志愿者审查
/help 列出此列表

将我添加至群组并给我删除消息的权限，我即可开始删除垃圾消息`, { reply_to_message_id: ctx.message.message_id });
});

bot.command('submit', submit);

bot
  .action('spam', spam)
  .action('ham', ham);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

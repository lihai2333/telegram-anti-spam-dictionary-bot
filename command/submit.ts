import { Markup } from 'telegraf';
import BlockList from './../lib/blocklist';
import config from './../config';
import { sify } from 'chinese-conv';
import emoji from './../RGI_Emoji';

export default async (ctx: any) => {
  if (ctx.chat.type !== 'private') {
    ctx.reply('此命令只能在私人聊天中使用', { reply_to_message_id: ctx.message.message_id });
    return;
  }

  let option = ctx.message.text
    .replace(/^\/submit(@.*?bot)?\s{1,}/i, '/submit ')
    .slice(8)
    .toLowerCase()
    .replace(/^\/(submit|help|start)\s/, '')
    .replace(/[,\.，。'"*@#$_&-\+\(\)\/\?!;:（）、“”：；！？\\\[\]~`\|•√π÷×¶∆£¢€¥\^°={}%©®™✓「」‘’［］↑\d]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\n/g, ' ');
  option = sify(option);

  if (option === '') {
    ctx.reply('提交消息方法：/submit 消息', { reply_to_message_id: ctx.message.message_id });
    return;
  }

  if (option.length === 1) {
    ctx.reply('很抱歉，不接受提交长度为一的消息', { reply_to_message_id: ctx.message.message_id });
    return;
  }

  ctx.replyWithChatAction('typing');

  const k = await new BlockList().get(option);

  if (k !== null) {
    ctx.reply('此消息已被提交过', { reply_to_message_id: ctx.message.message_id });
    return;
  }

  ctx.session ??= { count: 0 };
  ctx.session.count++;

  if (ctx.session.count === 1000) {
    ctx.reply('很抱歉，你提交消息的额度已耗尽', { reply_to_message_id: ctx.message.message_id });
    return;
  }

  const then = option.replace(emoji(), '');

  try {
    await new BlockList().add(option, false);

    if (then !== option) {
      const l = await new BlockList().get(then);
      if (l === null) {
        await new BlockList().add(then, false);
        ctx.reply(then, {
          chat_id: config.group,
          disable_web_page_preview: true,
          ...Markup.inlineKeyboard([
            Markup.button.callback('Spam', 'spam'),
            Markup.button.callback('Ham ✔️', 'ham')
          ])
        });
      }
    }

    ctx.reply(option, {
      chat_id: config.group,
      disable_web_page_preview: true,
      ...Markup.inlineKeyboard([
        Markup.button.callback('Spam', 'spam'),
        Markup.button.callback('Ham ✔️', 'ham')
      ])
    });
    ctx.reply('已提交给志愿者审核', { reply_to_message_id: ctx.message.message_id });
  } catch (err) {
    ctx.reply('因为某些原因，提交失败', { reply_to_message_id: ctx.message.message_id });
    console.log(err);
  }
}

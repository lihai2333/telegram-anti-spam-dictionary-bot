import { Markup } from 'telegraf';
import BlockList from './../lib/blocklist';
import config from './../config';

export default async (ctx: any) => {
  if (!config.volunteer.includes(ctx.callbackQuery.from.id)) {
    ctx.answerCbQuery('你不是志愿者不能点击按钮哦');
  }

  ctx.answerCbQuery();

  await new BlockList().update(ctx.callbackQuery.message.text, true);

  console.log(ctx.callbackQuery.from.id, ctx.message.text, 'spam');

  ctx.editMessageText(ctx.callbackQuery.message.text, {
    ...Markup.inlineKeyboard([
      Markup.button.callback('Spam ✔️', 'spam'),
      Markup.button.callback('Ham', 'ham')
    ])
  });
}

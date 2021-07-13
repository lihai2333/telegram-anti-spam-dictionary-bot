import BlockList from './../lib/blocklist';
import emoji from './../RGI_Emoji';

export default async (ctx: any, next: any) => {
  if (ctx.chat.type === 'private' || ctx?.message?.text === undefined) {
    await next();
    return;
  }

  await next();

  const message = ctx.message.text
    .toLowerCase()
    .replace(new RegExp('(\\ufe0f)', 'g'), '')
    .replace(/^\/(submit|help|start)\s/, '')
    .replace(/[,\.，。'"*@#$_&\-\+\(\)\/\?!;:（）、“”：；！？\\\[\]~`\|•√π÷×¶∆£¢€¥\^°={}%©®™✓「」‘’［］↑\d…【】➜※丨–—☞￥★◎✘█☛✚♛－·✈⏲�➡☑☟☰✖❤⬇‼◼☪♦⬅▲『』❣▫▪✌✉⚠❇㊙♨⚜☎☄♂⬆⚠]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\n/g, ' ');

  const k: any = await new BlockList().get(message);

  const then: string = message
    .replace(emoji(), '')
    .replace(new RegExp('(\\ud83c\\udff7|\\ud83c\\udd7e|\\u26f1|\\u20e3|\\ud83d\\udd78|\\ud83d\\udde3|\\u2764\\ufe0f|\\u2708\\ufe0f|\\ud83d\\udd76|\\ud83c\\udf96|\\u2601|\\ud83d\\udd77|\\ud83c\\ude37|\\ud83d\\udee9|\\ud83c\\udd71|\\ud83c\\udd70|\\uD83D\\uDDA5)', 'g'), '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s+/, '');

  let l: any = {
    spam: false
  }

  if (then !== message) {
    l = await new BlockList().get(then);
  }

  if (k === null || (k.spam === false && l.spam === false)) {
    return;
  }

  ctx.deleteMessage();
}

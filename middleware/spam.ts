import BlockList from './../lib/blocklist';

export default async (ctx: any, next: any) => {
  if (ctx.chat.type === 'private' || ctx?.message?.text === undefined) {
    await next();
    return;
  }

  await next();

  const k: any = await new BlockList().get(
    ctx.message.text
      .toLowerCase()
      .replace(/^\/(submit|help|start)\s/, '')
      .replace(/[,\.，。'"*@#$_&-\+\(\)\/\?!;:（）、“”：；！ ？\\\[\]~`\|•√π÷×¶∆£¢€¥\^°={}%©®™✓「」‘’［］↑\d]/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\n/g, ' ')
  );

  if (k === null || k.spam === false) {
    return;
  }

  ctx.deleteMessage();
}

import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/blocklist', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const listSchema = mongoose.Schema({
  text: String,
  spam: Boolean,
  hash: String
}, { collection: 'list' });

const listModel = conn.model('list', listSchema);

export default class BlockList {
  async get(text: string) {
    const hash = crypto.createHash('sha512');
    hash.update(text);

    return await listModel.findOne({ hash: hash.digest('hex') });
  }

  async count() {
    return await listModel.find().countDocuments();
  }

  async add(text: string, spam: boolean) {
    const hash = crypto.createHash('sha512');
    hash.update(text);

    await new listModel({
      text,
      spam,
      hash: hash.digest('hex')
    }).save();
  }

  async update(text: string, spam: boolean) {
    const hash = crypto.createHash('sha512');
    hash.update(text);

    await listModel.updateOne({ hash: hash.digest('hex') }, { spam });
  }
};

import * as mongoose from 'mongoose';
import { default as Text, TextModel, textSchema } from './Text';

export type TexterModel = mongoose.Document & {
  phoneNumber: string,

  city: string,
  state: string,

  texts: TextModel[]
};

const texterSchema = new mongoose.Schema({
  phoneNumber: String,
  
  city: String,
  state: String,

  texts: [textSchema]
}, { usePushEach: true });

const Texter = mongoose.model('Texter', texterSchema);
export default Texter;

import * as mongoose from 'mongoose';
import { DEFAULT_MESSAGE_DISPLAY_TIME, DEFAULT_COLOR } from './constants'


export type TextModel = mongoose.Document & {
  message: string,
  responseId: string,
  rejected: boolean,
  color: string,
  startTime: number,
  endTime: number
};

export type TexterModel = mongoose.Document & {
  phoneNumber: string,

  city: string,
  state: string,

  texts: TextModel[]
};

const textSchema = new mongoose.Schema({
  message: String,
  responseId: String,
  rejected: Boolean,
  color: { type: String, default: DEFAULT_COLOR },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: () => { Date.now() + DEFAULT_MESSAGE_DISPLAY_TIME * 1000 } }
});

const texterSchema = new mongoose.Schema({
  phoneNumber: String,
  
  city: String,
  state: String,

  texts: [textSchema]
}, { usePushEach: true });

export const Text = mongoose.model('Text', textSchema);

const Texter = mongoose.model('Texter', texterSchema);
export default Texter;

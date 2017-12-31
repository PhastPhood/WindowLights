import * as mongoose from 'mongoose';
import { DEFAULT_MESSAGE_DISPLAY_TIME, DEFAULT_COLOR, DEFAULT_EFFECT } from '../utils/constants'

export type TextModel = mongoose.Document & {
  texterId: any,
  unparsedMessage: string,
  message: string,
  color: string,
  effect: string,

  responseId: string,
  rejected: boolean,

  lastDisplayed: number,
  startTime: number,
  endTime: number
};

export const textSchema = new mongoose.Schema({
  texterId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Texter' },
  unparsedMessage: String,
  message: String,
  color: { type: String, default: DEFAULT_COLOR },
  effect: { type: String, default: DEFAULT_EFFECT },

  responseId: String,
  rejected: Boolean,

  lastDisplayed: { type: Date, default: null },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: () => { Date.now() + DEFAULT_MESSAGE_DISPLAY_TIME * 1000 } }
});

const Text = mongoose.model('Text', textSchema);
export default Text;

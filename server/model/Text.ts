import * as mongoose from 'mongoose';
import { DEFAULT_MESSAGE_DISPLAY_TIME, DEFAULT_COLOR } from '../utils/constants'

export type TextModel = mongoose.Document & {
  message: string,
  responseId: string,
  rejected: boolean,
  color: string,
  startTime: number,
  endTime: number
};

export const textSchema = new mongoose.Schema({
  message: String,
  responseId: String,
  rejected: Boolean,
  color: { type: String, default: DEFAULT_COLOR },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: () => { Date.now() + DEFAULT_MESSAGE_DISPLAY_TIME * 1000 } }
});

const Text = mongoose.model('Text', textSchema);
export default Text;

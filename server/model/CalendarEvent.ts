import * as mongoose from 'mongoose';
import { DEFAULT_MESSAGE_DISPLAY_TIME, DEFAULT_COLOR, DEFAULT_EFFECT } from '../utils/constants'

export type CalendarEventModel = mongoose.Document & {
  unparsedMessage: string,
  message: string,
  color: string,
  effect: string,

  lastDisplayed: number,
  startTime: number,
  endTime: number
};

export const calendarEventSchema = new mongoose.Schema({
  unparsedMessage: String,
  message: String,
  color: { type: String, default: DEFAULT_COLOR },
  effect: { type: String, default: DEFAULT_EFFECT },

  lastDisplayed: { type: Date, default: null },
  startTime: Date,
  endTime: Date
});

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);
export default CalendarEvent;

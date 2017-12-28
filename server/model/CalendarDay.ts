import * as mongoose from 'mongoose';
import { default as CalendarEvent, CalendarEventModel, calendarEventSchema } from './CalendarEvent';

export type CalendarDayModel = mongoose.Document & {
  date: number,

  events: CalendarEventModel[]
};

const calendarDaySchema = new mongoose.Schema({
  date: Date,

  events: [calendarEventSchema]
}, { usePushEach: true });

const CalendarDay = mongoose.model('CalendarDay', calendarDaySchema);
export default CalendarDay;

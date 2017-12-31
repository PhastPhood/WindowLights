import { createAction, Action } from 'redux-actions';

import { Text, Texter } from './model';

const CHANGE_REJECT_TEXT = 'CHANGE_REJECT_TEXT';
const changeRejectTextAction = createAction<Text, Text, boolean>(
  CHANGE_REJECT_TEXT,
  (text: Text, rejected: boolean) => ({ ...text, rejected: rejected })
);

const CHANGE_TEXT_MESSAGE = 'CHANGE_TEXT_MESSAGE';
const changeTextMessageAction = createAction<Text, Text, string>(
  CHANGE_TEXT_MESSAGE,
  (text: Text, message: string) => ({ ...text, message: message })
);

const CHANGE_BAN_TEXTER = 'CHANGE_BAN_TEXTER';
const changeBanTexterAction = createAction<Texter, Texter, boolean>(
  CHANGE_BAN_TEXTER,
  (texter: Texter, banned: boolean) => ({ ...texter, banned: banned })
);

const CHANGE_TAG_TEXTER = 'CHANGE_TAG_TEXTER';
const changeTagTexterAction = createAction<Texter, Texter, string>(
  CHANGE_TAG_TEXTER,
  (texter: Texter, tag: string) => ({ ...texter, tag: tag })
);

const FETCH_TEXTS = 'FETCH_TEXTS';
const fetchTextsAction = createAction<Text[], Text[]>(
  FETCH_TEXTS,
  (texts: Text[]) => texts
);

const FETCH_TEXTERS = 'FETCH_TEXTERS';
const fetchTextersAction = createAction<Texter[], Texter[]>(
  FETCH_TEXTERS,
  (texters: Texter[]) => texters
);

export { CHANGE_REJECT_TEXT,
  CHANGE_TEXT_MESSAGE,
  CHANGE_BAN_TEXTER,
  CHANGE_TAG_TEXTER,
  FETCH_TEXTS,
  FETCH_TEXTERS,
  changeRejectTextAction,
  changeTextMessageAction,
  changeBanTexterAction,
  changeTagTexterAction,
  fetchTextsAction,
  fetchTextersAction }

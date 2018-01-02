import { handleActions, Action } from 'redux-actions';
import { combineReducers } from 'redux';
import axios from 'axios';

import { Text, Texter, TextsState, TextersState } from './model';
import { CHANGE_REJECT_TEXT,
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
  fetchTextersAction } from './actions';

const initialTextsState: TextsState = [];
const initialTextersState: TextersState = [];

const textsStateReducer = handleActions<TextsState, Text | Text[]>({
  [CHANGE_TEXT_MESSAGE]: (state: TextsState, action: Action<Text>): TextsState => {
    return <TextsState>state.map(text => 
      text.id === action.payload.id ?
        { ...text, message: action.payload.message }
        : text
    );
  },

  [CHANGE_REJECT_TEXT]: (state: TextsState, action: Action<Text>): TextsState => {
    let newState = <TextsState>state.map(text => text.id === action.payload.id ?
      { ...text, rejected: action.payload.rejected }
      : text);
    return newState;
  },

  [FETCH_TEXTS]: (state: TextsState, action: Action<Text[]>): TextsState => {
    return <TextsState>action.payload;
  }
}, initialTextsState);

const textersStateReducer = handleActions<TextersState, Texter | Texter[]>({
  [CHANGE_TAG_TEXTER]: (state: TextersState, action: Action<Texter>): TextersState => {
    return <TextersState>state.map(texter => 
      texter.id === action.payload.id ?
        { ...texter, tag: action.payload.tag }
        : texter
    );
  },

  [CHANGE_BAN_TEXTER]: (state: TextersState, action: Action<Texter>): TextersState => {
    return <TextersState>state.map(texter =>  texter.id === action.payload.id ?
        { ...texter, banned: action.payload.banned }
        : texter
    );
  },

  [FETCH_TEXTERS]: (state: TextersState, action: Action<Texter[]>): TextersState => {
    return <TextersState>action.payload;
  }
}, initialTextersState);

const reducer = combineReducers({ texts: textsStateReducer, texters: textersStateReducer });

export default reducer;

export const changeTextMessage = (text: Text, newMessage: string) => dispatch => {
  axios.post(`/api/text/${text.id}`, { ...text, message: newMessage })
    .then(response => response.data)
    .then(text => dispatch(changeTextMessageAction(text, newMessage)))
    .catch(err => {
      console.error.bind(err);
    });
};

export const changeRejectText = (text: Text, reject: boolean) => dispatch => {
  axios.post(`/api/text/${text.id}`, { ...text, rejected: reject })
    .then(response => response.data)
    .then(text => { 
      dispatch(changeRejectTextAction(text, reject))
      return axios.get('/api/texts');
    })
    .then(response => response.data)
    .then(texts => dispatch(fetchTextsAction(texts)))
    .catch(err => {
      console.error.bind(err);
    });
};

export const fetchTexts = () => dispatch => {
  axios.get('/api/texts')
    .then(response => response.data)
    .then(texts => dispatch(fetchTextsAction(texts)))
    .catch(err => {
      console.error.bind(err);
    });
};

export const changeTagTexter = (texter: Texter, tag: string) => dispatch => {
  axios.post(`/api/texter/${texter.id}`, { ...texter, tag: tag })
    .then(response => response.data)
    .then(texter=> dispatch(changeTagTexterAction(texter, tag)))
    .catch(err => {
      console.error.bind(err);
    });
};

export const changeBanTexter = (texter: Texter, ban: boolean) => dispatch => {
  axios.post(`/api/texter/${texter.id}`, { ...texter, banned: ban })
    .then(response => response.data)
    .then(texter => {
      dispatch(changeBanTexterAction(texter, ban));
      return axios.get('/api/texts');
    })
    .then(response => response.data)
    .then(texts => dispatch(fetchTextsAction(texts)))
    .catch(err => {
      console.error.bind(err);
    });
};

export const fetchTexters = () => dispatch => {
  axios.get('/api/texters')
    .then(response => response.data)
    .then(texters => dispatch(fetchTextersAction(texters)))
    .catch(err => {
      console.error.bind(err);
    });
};

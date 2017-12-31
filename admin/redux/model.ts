export type Text = {
  id: string,
  texterId: string,
  phoneNumber: string,
  effect: string,
  color: string,
  message: string,
  rejected: boolean,
  lastDisplayed: number,
  startTime: number,
  endTime: number
};

export type Texter = {
  id: string,
  phoneNumber: string,
  city: string,
  state: string,
  banned: boolean,
  textIds: string[],
  tag: string,
  responseId: string
};

export type TextsState = Text[];

export type TextersState = Texter[];

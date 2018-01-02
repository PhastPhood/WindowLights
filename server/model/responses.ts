
const responses = {
  tooLongMessage: 'You\'re putting a message on a window that shows like 3 letters at a time. Keep it under 160 characters please!',
  tooLongId: 'tooLong',

  discriminatoryMessage: 'Looks like you might be using discriminatory language - don\'t be a jerk please.',
  discriminatoryId: 'discriminatory',

  starWarsMessage: 'Please no Star Wars spoilers!',
  starWarsId: 'starWars',

  bannedMessage: 'Somehow you\'ve managed to get banned from putting messages up on my window. Good job, and please don\'t send any more.',
  bannedId: 'banned',

  emailResponses: {
    bolognese: 'I\'m looking for quality Bolognese and gumbo recipes. If you have one, email me at ',
    lactose: 'I\'m lactose intolerant and always forget to bring Lactaid. If you know any solutions, please email me at ',
    romCom: 'I\'m looking for a rom-com suggestion. If you have one, email me at ',
    dog: 'If you have a cute dog, please email me a picture at ',
    toiletPaper: 'My mom says to try to understand other viewpoints. If you roll your toilet paper under, mail me at ',
    vanderbilt: 'If you also went to Vanderbilt and want to commisserate on our basketball team\'s performance, mail me at ',
    karaoke: 'I\'m looking for a karaoke buddy to sing "Chicken Fried." Feel free to send your qualifications to ',
    haiku: 'I would really appreciate it if you sent me a haiku at ',
    breakfast: 'I\'m looking for a good breakfast burrito in Seattle. If you have any suggestions, email me at ',
  },

  messageReceivedMessage: 'Your message will light up in a sec. ',
  replacementMessage: 'Your last message will be replaced. ',
  errorMessage: 'There was an error processing your message.',

  getResponseFromId(id: string, replace: boolean):string {
    if (id === this.tooLongId) {
      return this.tooLongMessage;
    }

    if (id === this.discriminatoryId) {
      return this.discriminatoryMessage;
    }

    if (id === this.starWarsId) {
      return this.starWarsMessage;
    }

    if (id === this.bannedId) {
      return this.bannedMessage;
    }

    if (this.emailResponses.hasOwnProperty(id)) {
      return replace ? this.replacementMessage + this.emailResponses[id] + process.env.EMAIL
          : this.messageReceivedMessage + this.emailResponses[id] + process.env.EMAIL;
    } else {
      return this.errorMessage;
    }
  }
}

export default responses;
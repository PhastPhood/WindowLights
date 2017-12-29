
const responses = {
  tooLongMessage: 'You\'re putting a message on a window that shows like 3 letters at a time. Keep it under 160 characters please!',
  tooLongId: 'tooLong',

  discriminatoryMessage: 'Looks like you might be using discriminatory language - don\'t be a dick please.',
  discriminatoryId: 'discriminatory',

  starWarsMessage: 'Please no Star Wars spoilers!',
  starWarsId: 'starWars',

  emailResponses: {
    bolognese: 'I\'m looking for a quality Bolognese recipe. If you have one, email me at ',
    clothing: 'I\'m convinced 0 people in Seattle own colorful clothing. If you have evidence to the contrary, mail to ',
    lactose: 'I\'m lactose intolerant and always forget to bring Lactaid. If you know any solutions, please email me at ',
    romCom: 'I\'m looking for a rom-com suggestion. If you have one (or any comments), email me at ',
    club: 'I\'m starting a club exclusively for people named Jeff, so if your name is Jeff, mail me at ',
    toiletPaper: 'My mom says to try to understand other viewpoints. If you roll your toilet paper under, mail me at ',
    email: 'I\'m debating if it\'s a good idea to include my email here. If you\'ve got strong case either way, mail to ',
    vanderbilt: 'If you also went to Vanderbilt and want to commisserate on our basketball team\'s performance, mail me at ',
    karaoke: 'I\'m looking for a karaoke buddy to sing "Chicken Fried." Feel free to send your qualifications to ',
    fear: 'My greatest fear in life is not getting enough emails. If you sympathize, tell me your experience at ',
    runescape: 'You can use RuneScape colors and effects on your message. 1v1 me in the wildy by emailing '
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

    if (this.emailResponses.hasOwnProperty(id)) {
      return replace ? this.replacementMessage + this.emailResponses[id] + process.env.EMAIL
          : this.messageReceivedMessage + this.emailResponses[id] + process.env.EMAIL;
    } else {
      return this.errorMessage;
    }
  }
}

export default responses;
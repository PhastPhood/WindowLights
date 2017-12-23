
const responses = {
  tooLongMessage: 'You\'re putting a message on a window that shows like 3 letters at a time. Keep it under 160 characters please!',
  tooLongId: 'tooLong',

  emailResponses: {
    bolognese: 'I\'m looking for a quality Bolognese recipe. If you have one, email me at jeffabq1@gmail.com.',
    clothing: 'I\'m convinced 0 people in Seattle own colorful clothing. If you have evidence to the contrary, mail to jeffabq1@gmail.com.',
    lactose: 'I\'m lactose intolerant and always forget to bring Lactaid. If you know any solutions, please email me at jeffabq1@gmail.com',
    romCom: 'I\'m looking for a rom-com suggestion. If you have one (or any comments), email me at jeffabq1@gmail.com.',
    club: 'I\'m starting a club exclusively for people named Jeff, so if your name is Jeff, mail me at jeffabq1@gmail.com',
    toiletPaper: 'My mom says to try to understand other viewpoints. If you roll your toilet paper under, mail me at jeffabq1@gmail.com.',
    email: 'I\'m debating if it\'s a good idea to include my email here. If you\'ve got strong case either way, mail to jeffabq1@gmail.com',
    vanderbilt: 'If you also went to Vanderbilt, mail me at jeffabq1@gmail.com and we can be sad about our basketball team together.',
    karaoke: 'I\'m looking for a karaoke buddy to sing "Chicken Fried." Feel free to send your qualifications to jeffabq1@gmail.com.',
    fear: 'My greatest fear in life is not getting enough emails. If you sympathize, tell me your experience at jeffabq1@gmail.com.'
  },

  messageReceivedMessage: 'Your message will light up in a sec. ',
  replacementMessage: 'Your last message will be replaced. ',
  errorMessage: 'There was an error processing your message.',

  getResponseFromId(id: string, replace: boolean):string {
    if (id == this.tooLongId) {
      return this.tooLongMessage;
    }

    if (this.emailResponses.hasOwnProperty(id)) {
      return replace ? this.replacementMessage + this.emailResponses[id]
          : this.messageReceivedMessage + this.emailResponses[id];
    } else {
      return this.errorMessage;
    }
  }
}

export default responses;
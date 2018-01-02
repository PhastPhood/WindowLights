let rawContacts = require('../data/rawContacts.json');

const contacts = rawContacts.map(contact => {
  return { ...contact, phoneNumber: '+1' + contact.phoneNumber };
});
export default contacts;

export const contactNumbers = contacts.map(entry => entry.phoneNumber);

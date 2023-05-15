import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { ContactForm } from './ContactForm/ContactForm';
import { Section } from './Section/Section';
import { Header } from './Header/Header';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';

const CONTACTS_STORAGE_KEY = 'CONTACTS';

const getInitialContacts = () => {
  let initialArray = [];
  const parsedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
  if (parsedContacts) {
    initialArray = JSON.parse(parsedContacts);
  }
  if (initialArray.length === 0) {
    initialArray = [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ];
  }
  return initialArray;
};

export function App() {
  const [contacts, setContacts] = useState(getInitialContacts());
  const [filter, setFilter] = useState('');

  useEffect(() => {
    try {
      const parsedContacts = JSON.stringify(contacts);
      localStorage.setItem(CONTACTS_STORAGE_KEY, parsedContacts);
    } catch (error) {
      console.error(error.message);
    }
  }, [contacts]);

  const addContact = contact => {
    const foundContact = contacts.find(
      cont => cont.name.toLowerCase() === contact.name.toLowerCase()
    );
    if (foundContact) {
      alert(`${foundContact.name} is already in contacts.`);
      return;
    }

    contact.id = nanoid();
    setContacts([contact, ...contacts]);
  };

  const deleteContact = id => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const changeFilter = e => {
    const { value } = e.currentTarget;
    setFilter(value);
  };

  const getVisibleContacts = () => {
    const normalizedFilter = filter.toLowerCase();

    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().trim().includes(normalizedFilter)
    );

    return filteredContacts;
  };

  return (
    <Section title="Phonebook">
      <ContactForm onAddContact={addContact} />
      <Header title="Contacts" />
      <Filter value={filter} onChange={changeFilter} />
      <ContactList contacts={getVisibleContacts()} onDelete={deleteContact} />
    </Section>
  );
}

App.propTypes = {
  contact: PropTypes.objectOf(
    PropTypes.exact({
      name: PropTypes.string.isRequired,
      contacts: PropTypes.objectOf({
        name: PropTypes.string.isRequired,
        number: PropTypes.string,
      }),
    })
  ),
};

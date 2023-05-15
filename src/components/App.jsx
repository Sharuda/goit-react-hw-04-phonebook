import { Component } from 'react';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { ContactForm } from './ContactForm/ContactForm';
import { Section } from './Section/Section';
import { Header } from './Header/Header';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';

const CONTACTS_STORAGE_KEY = 'CONTACTS';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    try {
      const parsedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
      if (parsedContacts) {
        this.setState({ contacts: JSON.parse(parsedContacts) });
      } else {
        this.setState({
          contacts: [
            { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
            { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
            { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
            { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
          ],
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      try {
        const serializedState = JSON.stringify(this.state.contacts);
        localStorage.setItem(CONTACTS_STORAGE_KEY, serializedState);
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  addContact = newContact => {
    const { contacts } = this.state;
    const foundContact = contacts.find(
      contact => contact.name.toLowerCase() === newContact.name.toLowerCase()
    );
    if (foundContact) {
      alert(`${foundContact.name} is already in contacts.`);
      return;
    }

    newContact.id = nanoid();
    this.setState(prevState => ({
      contacts: [newContact, ...prevState.contacts],
    }));
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value.toLowerCase() });
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  render() {
    const { filter } = this.state;
    const visibleContacts = this.getVisibleContacts();
    return (
      <Section title="Phonebook">
        <ContactForm onAddContact={this.addContact} />
        <Header title="Contacts" />
        <Filter value={filter} onChange={this.changeFilter} />
        <ContactList contacts={visibleContacts} onDelete={this.deleteContact} />
      </Section>
    );
  }
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

import { useEffect, useState } from 'react';
const savedStorage = localStorage.getItem('storage');
let parsedStorage = JSON.parse(savedStorage);
parsedStorage = !parsedStorage ? [] : parsedStorage;

export default function App() {
  const [contactList, setContactList] = useState(parsedStorage.list);

  function handleContactList(newContact) {
    console.log(newContact);
    setContactList(contactList => [...contactList, newContact]);

    //console.log(contactList);
  }

  useEffect(() => {
    const storage = {
      list: contactList,
    };
    localStorage.setItem('storage', JSON.stringify(storage));
  }, [contactList]);

  function handleDeleteContact(number) {
    setContactList(contactList =>
      contactList.filter(contact => contact.number !== number)
    );
  }

  return (
    <div style={{ padding: '50px' }}>
      <Phonebook
        handleContactList={handleContactList}
        contactList={contactList}
      />
      <Contacts
        contacts={contactList}
        handleDeleteContact={handleDeleteContact}
      />
    </div>
  );
}

function Phonebook({ handleContactList, contactList }) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  function checkName(name) {
    const nameList = contactList.map(contact => contact.name);
    for (let i = 0; i < nameList.length; i++)
      if (nameList[i] === name) return false;

    return true;
  }

  function checkNumber(number) {
    if (!number.match(/^([0-9]{3}-[0-9]{3}-[0-9]{3})/)) return false;

    const numberList = contactList.map(contact => contact.number);
    for (let i = 0; i < numberList.length; i++)
      if (numberList[i] === number) return false;

    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    // console.log(name + number);
    const boolName = checkName(name);
    const boolNumber = checkNumber(number);
    if (boolName && boolNumber) handleContactList({ name, number });

    if (!boolName) alert('The name is already in the contact list');
    if (!boolNumber)
      alert(
        'The number is either wrong (we accept only in the format 123-456-789), or is already in the contact list'
      );
  }

  return (
    <>
      <h2>Phonenook</h2>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '270px',
        }}
        onSubmit={e => handleSubmit(e)}
      >
        <label
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          Name
          <input value={name} onChange={e => setName(e.target.value)}></input>
        </label>

        <label
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          Number
          <input
            value={number}
            onChange={e => setNumber(e.target.value)}
          ></input>
        </label>
        <button
          style={{ padding: '5px', width: '100px', marginTop: '20px' }}
          type="submit"
        >
          Add Contact
        </button>
      </form>
    </>
  );
}

function Contacts({ contacts, handleDeleteContact }) {
  const [search, setSearch] = useState('');

  function searchContact(target) {
    const possibleList = contacts.filter(contact => {
      const normalizedTarget = target.toLowerCase().trim();
      const normalizedContact = contact.name.toLowerCase().trim();
      return normalizedContact.includes(normalizedTarget);
    });
    return (
      <div>
        {possibleList.map(contact => (
          <Contact
            name={contact.name}
            number={contact.number}
            key={contact.number}
            handleDeleteContact={handleDeleteContact}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ marginTop: '50px' }}>
      <h2>Contacts</h2>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        Search contacts by name
        <input
          style={{ width: '200px' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        ></input>
      </label>
      {!search &&
        contacts.map(contact => (
          <Contact
            name={contact.name}
            number={contact.number}
            key={contact.number}
            handleDeleteContact={handleDeleteContact}
          />
        ))}
      {search && searchContact(search)}
    </div>
  );
}

function Contact({ name, number, handleDeleteContact }) {
  function handleDelete() {
    handleDeleteContact(number);
  }
  return (
    <div style={{ marginTop: '25px' }}>
      <span>{name}</span>: <span>{number}</span>
      <button style={{ marginLeft: '10px' }} onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}

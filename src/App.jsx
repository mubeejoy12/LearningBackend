import { useEffect, useState } from "react";
import "./App.css";

import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  // fetch data from server on first render
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);
  const addPerson = (event) => {
    event.preventDefault();
    console.log("Submitting form...");
    console.log("newName:", newName);
    console.log("newNumber:", newNumber);

    const personObject = { name: newName, number: newNumber };
    console.log("personObject to send:", personObject);

    // check if person exists
    const existing = persons.find((p) => p.name === newName);
    if (existing) {
      console.log("Person already exists:", existing);
      if (window.confirm(`${newName} is already added. Replace number?`)) {
        const changedPerson = { ...existing, number: newNumber };
        personService
          .update(existing.id, changedPerson)
          .then((returnedPerson) => {
            console.log("Updated person returned from server:", returnedPerson);
            setPersons(
              persons.map((p) => (p.id !== existing.id ? p : returnedPerson))
            );
            setNewName("");
            setNewNumber("");
          });
      }
    } else {
      personService.create(personObject).then((returnedPerson) => {
        console.log("New person returned from server:", returnedPerson);
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name:{" "}
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

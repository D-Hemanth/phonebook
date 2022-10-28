import Person from "./Person"

const Persons = ({ persons, handleDeleteChange }) => {
    return (
        <div>
            {persons.map((person) => <Person persons={persons} person={person} key={person.name} handleDeleteChange={handleDeleteChange} />)}
        </div>
    )
}

export default Persons
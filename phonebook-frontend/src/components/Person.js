const Person = ({ person, handleDeleteChange, persons }) => {
    return (
        <div>{person.name} {person.number} <button onClick={() => handleDeleteChange(person, persons)}>delete</button></div>
    )
}

export default Person
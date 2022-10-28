const PersonForm = ({ addName, newName, handleNameChange, newNumber, handleNumberChange }) => {
    return (
        <form onSubmit={addName}>
            <div>name: <input onChange={handleNameChange} value={newName} /></div>
            <div>number: <input onChange={handleNumberChange} value={newNumber} /></div>
            <div><button type="submit">add</button></div>
        </form>
    )
}

export default PersonForm
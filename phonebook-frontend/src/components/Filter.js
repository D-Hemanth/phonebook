const Filter = ({ value, onChange }) => {
    return (
        <form>
            <div>filter shown with <input onChange={onChange} value={value} /></div>
        </form>
    )
}

export default Filter
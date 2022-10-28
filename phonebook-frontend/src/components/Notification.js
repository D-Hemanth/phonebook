const Notification = ({ message, messageColor }) => {
    if(message === null) {
        return null
    }

    return (
        <div className={messageColor}>{message}</div>
    )
}

export default Notification
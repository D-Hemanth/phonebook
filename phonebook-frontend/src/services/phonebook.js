import axios from "axios";
const baseurl = '/api/persons'

// do a axios get request to the url to collect phonebook data from the server
const getAll = () => {
    const request = axios.get(baseurl)
    return request.then(response => response.data)
}

// do a axios post request to the url to send & store user input phonebook data in the backend server 
const create = (phonebookObject) => {
    const request = axios.post(baseurl, phonebookObject)
    return request.then(response => response.data)
}

// do a axios delete request to the url to delete phonebook data from the backend server 
const deleteContact = (id) => {
    const request = axios.delete(`${baseurl}/${id}`)
    // return request.then(response => console.log('chosen phonebook data deleted'))
}

// do a axios put request to the url to update or change the phone number of existing name in phonebook
const update = (id, newNumberObject) => {
    const request = axios.put(`${baseurl}/${id}`, newNumberObject)
    return request.then(response => response.data)
}
    

// export the getAll, create  as an object of any name i.e. here in app - phonebookService to use these methods in app
export default { getAll, create, deleteContact, update }
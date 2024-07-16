
function loggedInUser() {
    return JSON.parse(localStorage.getItem('owner'),);
}

export default loggedInUser
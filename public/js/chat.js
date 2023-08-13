const socket = io()
const chatbox = document.getElementById('chatbox')
let user = sessionStorage.getItem('user') || ''

if(!user) { 
Swal.fire({
    title: 'auth',
    input: 'text',
    text: 'Set username',
    inputValidator: value => {
        return !value.trim() && 'please write a username'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value
    document.getElementById('username').innerHTML = user
    sessionStorage.setItem('user', user)
    socket.emit('new', user)
})
}else {
    document.getElementById('username').innerHTML = user
    socket.emit('new', user)
}
chatbox.addEventListener('keyup', event => {
    if(event.key === 'Enter') {
        const message = chatbox.value.trim()
        if(message.length > 0) {
            socket.emit('message', {
                user, message
            })

            chatbox.value = ''
        }
    }
})

socket.on('logs', data => {
    console.log(data)
    const divLogs = document.getElementById('logs')
    let messages = ''

    data.forEach(msn => { 
    messages = `<p><i>${msn.user}</i>: ${msn.message}` + messages
    
});
    divLogs.innerHTML = messages
})
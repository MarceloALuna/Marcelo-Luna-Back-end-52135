const socket = io();
let user = '';
let email = '';
let chatBox = document.getElementById('chatbox');


if (!user) {
    Swal.fire({
        title: 'Auth',
        input: 'text',
        text: 'Set username',
        inputValidator: value => {
            return !value.trim() && 'Please. Write a username'
        },
        allowOutsideClick: false
    }).then(result => {
        user = result.value
        document.getElementById('username').innerHTML = user
        sessionStorage.setItem("user", user)
        socket.emit('new', user)
    })
} else {
    document.getElementById('username').innerHTML = user
    socket.emit('new', user)
}


// Enviar mensajes
chatbox.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        const message = chatbox.value.trim()
        if (message.length > 0) {
            socket.emit('message', {
                user,
                message
            })

            chatbox.value = ''
        }
    }
})

// Recibir Mensajes
socket.on('logs', data => {
    const divLogs = document.getElementById('logs')
    console.log(data)
    let messages = ''

    data.forEach(msn => {
        messages = `<p><i>${msn.user}</i>: ${msn.message}</p>` + messages
    })

    divLogs.innerHTML = messages
})


// Swal.fire({
//     title: 'Authentication',
//     input: 'text',
//     text: 'Set username for the LunaChat',
//     inputValidator: value => {
//         return !value.trim() && 'Please. Write a username!'
//     },
//     allowOutsideClick: false
// }).then( result => {
//     user = result.value;
//     document.getElementById('username').innerHTML = user
//     Swal.fire({
//         title: 'Input email address',
//         input: 'email',
//         inputLabel: 'Your email address',
//         inputPlaceholder: 'Enter your email address',
//         allowOutsideClick: false
//     }).then( result => {
//         email = result.value;
//         document.getElementById('email').innerHTML = email
//     })
// })




// chatBox.addEventListener('keyup', event =>{
//     if(event.key === 'Enter'){
//         if(chatBox.value.trim().length > 0){
//             socket.emit('messagein', {
//                 email,
//                 user,
//                 message: chatBox.value,
//                 date: `${new Date().getHours()}:${new Date().getMinutes()}`
//             })
//             chatBox.value = '';
//         }
//     }
// })

// //recibir messages

// socket.on('messageout', data => {
//     const divLog = document.getElementById('messageLogs')
//     let messages = ''

//     data.reverse().forEach(message => {
//         messages += `<div class='bubble'><i class='bubble-user'>${message.user}</i><p class='bubble-message'>${message.message}<span class='hour'>${message.date}</span></p></div>`
//     });

//     divLog.innerHTML = messages
// })
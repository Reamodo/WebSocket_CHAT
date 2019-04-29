const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server) // const io s'excute avec le serveur

const path = require('path') //path (package node) path.resolve

let messages = []

app.use(express.static(path.resolve('./assets'))) //path.resolve
app.get('/', (req, res) => { // app -> serveru web
  res.sendFile(__dirname + '/index.html') // sendFile (server Node) renvoie de fichier html
});

//.on permet de passer event ('conection')
io.on('connection', socket => {

    socket.on('recuperationMessage', () => {
        socket.emit('recuperationMessage', messages)
    })
    socket.on('user', ({username}) => { //'user' nom de l'event
        console.log(username, 'is connected !')
        socket.emit('user') //.emit emet le meme event coté back (l'utilisateur)
    })

    socket.on('message', _data => {
        console.log(_data)
        messages.push(_data)
        io.emit('message', _data)
    })
})

server.listen(3000) //=> server web created http

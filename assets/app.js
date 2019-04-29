class Chat {
    constructor (_socketUrl) {
        this.socket = io.connect(_socketUrl) //se connecte à _socketUrl
        this.username = undefined

        this.htmlElements = {
            hide: document.querySelector('.hide'),
            username: document.querySelector('.username'),
            join: document.querySelector('.join'),
            messages: document.querySelector('.messages').children[0],
            message: document.querySelector('input.message'),
            sendMessage: document.querySelector('.sendMessage .send')
        }

        this.init()
    }

    init () {
        this.htmlElements.join.addEventListener('click', () => {
            const username = this.htmlElements.username.value
            this.username = username
            this.htmlElements.hide.style.display = 'none'

            this.socket.on('message', _data => {
                console.log(_data)
                this.receiveMessage(_data)
            })
            
            this.socket.emit('user', { //emit : emettre un event 'user' -> nom de l'event
                username
            })
        })

        this.socket.on('user', () => { // enregistre tous les events (pseudo securité)
            this.htmlElements.sendMessage.addEventListener('click', () => {
                this.sendMessage()
            })
            
        this.htmlElements.message.addEventListener('keydown',() => {
            if (event.keycode === 13) {
                this.sendMessage()
                }
            })
        })

        this.socket.on('recuperationMessage', _data => {
            _data.forEach(message => {
                this.receiveMessage(message)
            })
        })
        this.socket.emit('recuperationMessage')
    }

    sendMessage () {
        const message = this.htmlElements.message.value
        this.htmlElements.message.value = '' // recupere la value de l'input
    
        //envoie du message sur le serveur, se chargera de l'afficher
        this.socket.emit('message', {
            username: this.username,
            message,
            date: new Date
        })
    }

    receiveMessage(_data) {
        const messageEl = document.createElement('li')
        messageEl.innerHTML = `<span class="user">${_data.username} ></span><span class="message"> ${_data.message.trim()}</span>`
        messageEl.classList.add('message')

        this.htmlElements.messages.appendChild(messageEl)
    }
}

const chat = new Chat('http://localhost:3000')


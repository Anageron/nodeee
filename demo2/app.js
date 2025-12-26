const EventEmmiter = require('events');

const myEmmiter  = new EventEmmiter()

const logDbConnection = () => {
    console.log('DB coonect')
}

myEmmiter.addListener('connected', logDbConnection)
myEmmiter.emit('connected')

myEmmiter.removeListener('connected', logDbConnection)
myEmmiter.emit('connected')
const users = require('../controllers/users');

let setRouter = (app) => {
    app.post('/register', users.register);
    app.post('/login', users.login);
}

module.exports = {
    setRouter: setRouter
}
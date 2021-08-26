if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const app = express();

const initializePassport = require('./passport-config')

initializePassport(passport, email => users.find(user => user.email === email))

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SCRECT,
    resave: false,
    saveUninitialized: false
}))


app.get('/', (req, res) => {
    res.render('index.ejs', {name: 'daniel'})
})

app.get('/login', (req, res) => {
    res.render('login.ejs', {name: 'daniel'})
})

app.get('/register', (req, res) => {
    res.render('register.ejs', {name: 'daniel'})
})

app.post('/register', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        res.redirect('/login')
    } catch (err){
        console.log(err)
        res.redirect('/register')
    }
    console.log(users)
})

app.listen(3000)
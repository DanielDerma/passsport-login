if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config')

initializePassport(passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id))

const users = []
 
app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SCRECT,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name})
})

app.get('/login',checkNoAuthenticated, (req, res) => {
    res.render('login.ejs', {name: 'daniel'})
})
app.post('/login', checkNoAuthenticated, passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: '/login', 
    failureFlash: true
}))

app.get('/register',checkNoAuthenticated, (req, res) => {
    res.render('register.ejs', {name: 'daniel'})
})
app.post('/register',checkNoAuthenticated,  async(req, res) => {
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

app.delete('/logout', (req, res) => {
    console.log('delete app requiest')
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNoAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}    



app.listen(3000)
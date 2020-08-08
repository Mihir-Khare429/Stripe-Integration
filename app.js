const express = require('express');
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const exhbs = require('express-handlebars');
const app = express();

app.engine('handlebars',exhbs({defaultLayout:'main'}));
app.set('view engine','handlebars');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(`${__dirname}/public`))

app.get('/',(req,res) => {
    res.render('index')
})

app.post('/charge',(req,res) => {
    const amount = 2500
    stripe.customers.create({
        email : req.body.stripeEmail,
        source : req.body.stripeToken
    }).then(customer => stripe.charges.create({
        amount,
        description : 'Web Ebook',
        currency : 'inr',
        customer:customer.id
    })).then(charge => res.render('success'))
})

const port = process.env.PORT || 5000

app.listen(port,() => {
    console.log(`App is listening on ${port}`)
})
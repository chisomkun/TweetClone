const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const http = require('http')
const PORT = process.env.PORT || 5000
const rateLimit = require('express-rate-limit');
var path = require('path');
var open = require('open');

const app = express();

const db = monk(process.env.MONGODB_URI || 'localhost/Slimey');
const slats = db.get('slats');
const filter = new Filter();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/../client')));


app.get('/slats', (req,res) =>{
    slats
      .find()
      .then(slats => {
          res.json(slats);
      });
});


app.get('/', function(req, res) {
    res.sendFile('client/index.html', { root: '../'});
});

function isValidSlat(slat){
    return slat.name && slat.name.toString().trim() !== '' &&
     slat.content && slat.content.toString().trim() !== '';
};



app.use(rateLimit({
    windowMs:  30 * 1000,
    max: 2
}));


app.post('/slats', (req, res) => {
    if(isValidSlat(req.body)){
        const slat = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()

        };
        slats
            .insert(slat)
            .then(createdSlat => {
                res.json(createdSlat);
            });
    }else{
        res.status(422);
        res.json({
            message: 'Hey! Name and Content are required!'
        });
    }
});

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '/../client')));
}

app.listen(PORT, () => {
    console.log('Listening on http://localhost:5000');
});
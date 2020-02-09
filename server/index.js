const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/Slimey');
const slats = db.get('slats');
const filter = new Filter();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) =>{
    res.json({
        message: 'Mad Slatter!'
    });
});

app.get('/slats', (req,res) =>{
    slats
      .find()
      .then(slats => {
          res.json(slats);
      });
});

function isValidSlat(slat){
    return slat.name && slat.name.toString().trim() !== '' &&
     slat.content && slat.content.toString().trim() !== '';
};

app.use(rateLimit({
    windowMs:  15 * 60 * 1000,
    max: 1
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

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});
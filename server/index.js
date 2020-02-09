const express = require('express');
const cors = require('cors');
const monk = require('monk');

const app = express();

const db = monk('localhost/Slimey');
const slats = db.get('slats');

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

app.post('/slats', (req, res) => {
    if(isValidSlat(req.body)){
        const slat = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
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
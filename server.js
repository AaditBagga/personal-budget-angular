//Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port =3000;

app.use(cors());

const fs = require('fs');

app.get('/budget', (req, res) => {
    fs.readFile('budget-data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log('API served at http://localhost:${port}');
}); 
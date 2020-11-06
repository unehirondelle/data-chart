const express = require('express');
const cors = require('cors');
const app = express();

const example = require('./example.js')

const whitelist = ['http://localhost:3002']
const corsOptions = {
    origin: function (origin, callback) {
        // if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        // } else {
        //     callback(new Error('Not allowed by CORS'))
        // }
    }
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/data', async function (req, res, next) {
    // switch (req.headers.function) {
    //     case "example":
            await example.data.get_data(req, res);

            // break;
    // }
})

app.listen(3002);
const express = require('express');
const base64 = require('base-64');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

const whitelist = ['http://127.0.0.1:3000/', 'https://data-chart-app.herokuapp.com/']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/data/:hostName/:chartName/:metricName', async function (req, res, next) {
    const hostName = req.params.hostName;
    const chartName = req.params.chartName;
    const metricName = req.params.metricName;

    const timePeriod = metricName === '*' ? '-2min' : '-1h';
    console.log(`metricName=${metricName}, timePeriod=${timePeriod}`)
    await fetch(`http://18.236.126.230/render?target=icinga2.${hostName}.services.${chartName}.check_nrpe.perfdata.${metricName}.value&from=${timePeriod}&format=json`, {
        headers: {
            'Accept': 'application/json',
            "Authorization": `Basic ${base64.encode(`tester:testing`)}`
        }
    })
        .then(res => res.json())
        .then(json => {
            res.send(json)
        })
        .catch(function (err) {
            res.send(err)
        });
})

if (process.env.NODE_ENV === 'production') {
    // serve static files
    app.use(express.static(path.join(__dirname, 'client/build')));

    // handle React routing
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(PORT);
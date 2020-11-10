const express = require('express');
const base64 = require('base-64');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

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


app.get('/data/:hostName/:chartName/:metricName', async function (req, res, next) {
    const hostName = req.params.hostName;
    const chartName = req.params.chartName;
    const metricName = req.params.metricName;

    await fetch(`http://18.236.126.230/render?target=icinga2.${hostName}.services.${chartName}.check_nrpe.perfdata.${metricName}.value&from=-1h&format=json`, {
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

app.listen(3002);
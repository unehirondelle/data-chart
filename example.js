const base64 = require('base-64');
const fetch = require('node-fetch');

const example = {
    get_data: async function(req, res){

        await fetch (`http://18.236.126.230/render?target=icinga2.logic-test-0*.host.hostalive.perfdata.*.value&from=-5d&format=json`, {
            headers: {
                'Accept': 'application/json',
                "Authorization": `Basic ${base64.encode(`tester:testing`)}`
            }
        })
            .then(res => res.json())
            .then(json => {
                res.send(json)
            })
            .catch(function(err) {
                res.send(err)
            });

    }
}

exports.data = example;
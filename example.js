const base64 = require('base-64');
const fetch = require('node-fetch');

const example = {
    get_data: async function(req, res){

        await fetch (`http://18.236.126.230/render?target=icinga2.logic-test-01.services.Linux_CPU.check_nrpe.perfdata.idle.value&from=-1h&format=json`, {
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
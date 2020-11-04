import './App.css';

import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

class App extends Component {

    const
    state = {
        labels: ['January', 'February', 'March',
            'April', 'May'],
        datasets: [
            {
                label: 'Rainfall',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: [65, 59, 80, 81, 56]
            }
        ]
    }

    componentDidMount() {

        fetch(`http://localhost:3002/data`)
            .then(
                res => res.json()
            )
            .then(json => {
                console.log('json', json);
                return JSON.stringify(json)
                /* json.map(i => setData({
                    labels: i.target,
                    datasets: {
                        label: 'Rainfall',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        data: [65, 59, 80, 81, 56]
                    }
                }), [])*/
            }).then(jsonStr => {
            console.log('jsonStr', jsonStr);
            jsonStr.map(i => {
                console.log('item', i);
                this.setState({labels: i.target, datasets: i.datapoints})
            })
        })
            .catch(function (err) {
                console.log(err);
            });
    };

    render() {
        return (
            <div className="App">
                <Line
                    data={this.state}
                    options={{
                        title: {
                            display: true,
                            text: 'Testing the chart',
                            fontsize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }}
                />
            </div>
        );
    }
}

export default App;

import './App.css';

import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

class App extends Component {

    const
    state = {
        labels: [],
        datasets: [
            {
                label: 'CPU',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: []
            }
        ]
    }


    componentDidMount() {
        let updatedState = {...this.state};
        fetch(`http://localhost:3002/data`)
            .then(
                res => res.json()
            )
            .then(jsonStr => {
                console.log('jsonStr', jsonStr);
                jsonStr.map(i => {
                    console.log('item', i.datapoints);
                    i.datapoints.map(dataItem => {
                        let [load, date] = dataItem;
                        if (load !== null) {
                            let dateLabel = new Date(date * 1000);
                            updatedState.labels.push(dateLabel);
                            updatedState.datasets[0].data.push(load);
                            console.log('updatedState', updatedState);
                        }
                    })
                })
            })
            .then(data => {
                this.setState(updatedState)
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

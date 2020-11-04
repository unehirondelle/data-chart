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
                data: [65, 59.5, 80.4, 100.5, 56]
            }
        ]
    }

    componentDidMount() {

        fetch(`http://localhost:3002/data`)
            .then(
                res => res.json()
            )
            /*.then(json => {
                console.log('json', json);
                return JSON.stringify(json)
            })*/
            .then(jsonStr => {
                console.log('jsonStr', jsonStr);
                jsonStr.map(i => {
                    console.log('item', i.datapoints);
                    i.datapoints.map(dataItem => {
                        let [load, date] = dataItem;
                        if (load !== null) {
                            // console.log('load', load)
                            let dateLabel = new Date(date);
                            this.setState(prevState => ({
                                    labels: [...prevState.labels, dateLabel],
                                    // datasets: [...prevState.datasets[0].data, load]
                                }
                            ))
                        }
                    })
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

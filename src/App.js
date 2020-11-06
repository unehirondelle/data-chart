import './App.css';
import moment from 'moment';
import Header from './components/header/header';
import {Row} from "react-bootstrap";
import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

class App extends Component {

    const
    state = {
        labels: [],
        datasets: [
            {
                fill: false,
                label: 'load',
                lineTension: 0.5,
                backgroundColor: 'rgba(235, 247, 233, 1)',
                borderColor: 'rgba(94, 240, 50, 1)',
                borderWidth: 0.5,
                pointRadius: 0,
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
                            updatedState.labels.push(moment(dateLabel).format('HH:mm:ss'));
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
            <>
                <Header/>
                <div className="App">
                    <Row>
                        <Line
                            data={this.state}
                            options={{
                                title: {
                                    display: true,
                                    text: 'CPU',
                                    fontsize: 20
                                },
                                legend: {
                                    display: true,
                                    position: 'right'
                                },
                                layout: {
                                    padding: {
                                        left: 50,
                                        right:100,
                                        top: 100,
                                        bottom: 0
                                    }
                                }
                            }}
                        />
                    </Row>
                </div>
                <footer className='bg-dark text-center p-2'>
                    <small className='text-white'>Irina Plaksina &copy; 2020</small>
                </footer>
            </>
        );
    }
}

export default App;

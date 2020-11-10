import './App.css';
import moment from 'moment';
import Header from './components/header/header';
import {Container, Row, Col, Form, InputGroup, Button, ButtonGroup} from "react-bootstrap";
import React, {Component} from 'react';
import {Line, Pie} from 'react-chartjs-2';

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
        ],
        hostName: 'logic-test-01',
        chartName: 'Linux_CPU',
        metricName: 'idle'
    }


    componentDidMount() {
        let updatedState = {...this.state};
        const {hostName, chartName, metricName} = this.state;
        fetch(`http://localhost:3002/data/${hostName}/${chartName}/${metricName}`)
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
                <Container className="App">
                    <Row className='mt-2'>
                        <Col xs={4}>
                            <InputGroup size='sm' className='hostSelector shadow'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="hostOptions" className='dark-label'>Host</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control as='select' aria-label='Small' aria-describedby='hostOptions'
                                              className='dark-control'>
                                    <option>logic-test-01</option>
                                    <option>logic-test-02</option>
                                </Form.Control>
                            </InputGroup>
                        </Col>
                        <Col xs={{span: 4, offset: 4}}>
                            <ButtonGroup size='sm' aria-label="memoryData" className='shadow'>
                                <Button variant="secondary" className='dark-button'>Active</Button>
                                <Button variant="secondary" className='dark-button'>MemUsed</Button>
                                <Button variant="secondary" className='dark-button'>MemCached</Button>
                                <Button variant="secondary" className='dark-button'>SwapUsed</Button>
                                <Button variant="secondary" className='dark-button'>SwapCached</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col xs={4}>
                            <ButtonGroup size='sm' aria-label="cpuData" className='shadow'>
                                <Button variant="secondary" className='dark-button'>idle</Button>
                                <Button variant="secondary" className='dark-button'>user</Button>
                                <Button variant="secondary" className='dark-button'>system</Button>
                                <Button variant="secondary" className='dark-button'>iowait</Button>
                                <Button variant="secondary" className='dark-button'>steal</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs lg={8}>
                            <Line className='shadow'
                                  data={this.state}
                                  options={{
                                      title: {
                                          display: true,
                                          text: 'Linux CPU',
                                          fontsize: 20
                                      },
                                      legend: {
                                          display: true,
                                          position: 'right'
                                      },
                                      layout: {
                                          padding: {
                                              left: 10,
                                              right: 10,
                                              top: 10,
                                              bottom: 10
                                          }
                                      }
                                  }}
                            />
                        </Col>
                        <Col xs lg={4}>
                            <Pie
                                data={this.state}
                                options={{
                                    title: {
                                        display: true,
                                        text: 'Linux Memory',
                                        fontsize: 20
                                    },
                                    legend: {
                                        display: false,
                                        position: 'bottom'
                                    },
                                    layout: {
                                        padding: {
                                            left: 10,
                                            right: 10,
                                            top: 10,
                                            bottom: 10
                                        }
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col xs={4}>
                            <ButtonGroup size='sm' aria-label="networkData" className='shadow'>
                                <Button variant="secondary" className='dark-button'>eth0_txbyt</Button>
                                <Button variant="secondary" className='dark-button'>eth0_txerrs</Button>
                                <Button variant="secondary" className='dark-button'>eth0_rxbyt</Button>
                                <Button variant="secondary" className='dark-button'>eth0_rxerrs</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs lg={8}>
                            <Line
                                data={this.state}
                                options={{
                                    title: {
                                        display: true,
                                        text: 'Linux Network',
                                        fontsize: 20
                                    },
                                    legend: {
                                        display: true,
                                        position: 'right'
                                    },
                                    layout: {
                                        padding: {
                                            left: 10,
                                            right: 10,
                                            top: 10,
                                            bottom: 10
                                        }
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                </Container>
                <footer className='fixed-bottom bg-dark text-center p-2'>
                    <small className='text-white'>Irina Plaksina &copy; 2020</small>
                </footer>
            </>
        );

        /*function handleParameterChoice() {
            let selectedHostName = document.getElementsByClassName('hostName').value;
            this.setState({hostName: selectedHostName});
            console.log({selectedHostName});
        };*/
    }
}

export default App;

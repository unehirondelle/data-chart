import './App.css';
import moment from 'moment';
import Header from './components/header/header';
import {Container, Row, Col, Form, InputGroup, Button, ButtonGroup} from "react-bootstrap";
import React, {Component} from 'react';
import {Line, Pie} from 'react-chartjs-2';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({hostName: event.target.value});
    }

    componentDidMount() {
        let updatedState = {...this.state};
        let loadArray = [];
        let labelsArray = [];
        const {hostName, chartName, metricName} = this.state;
        fetch(`http://localhost:3002/data/${hostName}/${chartName}/${metricName}`)
            .then(
                res => res.json()
            )
            .then(jsonStr => {
                jsonStr.map(i => {
                    i.datapoints.map(dataItem => {
                        let [load, date] = dataItem;
                        if (load !== null) {
                            let dateLabel = new Date(date * 1000);
                            labelsArray.push(moment(dateLabel).format('HH:mm:ss'));
                            loadArray.push(load);
                            updatedState.labels = labelsArray;
                            updatedState.datasets[0].data = loadArray;
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


    componentDidUpdate(prevProps, prevState) {
        if ((prevState.hostName !== this.state.hostName) || (prevState.chartName !== this.state.chartName) || (prevState.metricName !== this.state.metricName)) {
            let updatedDatasets = [...this.state.datasets];
            let updatedLabels = [...this.state.labels];
            let loadArray = [];
            let labelsArray = [];
            const {hostName, chartName, metricName} = this.state;
            fetch(`http://localhost:3002/data/${hostName}/${chartName}/${metricName}`)
                .then(
                    res => res.json()
                )
                .then(jsonStr => {
                    jsonStr.map(i => {
                        i.datapoints.map(dataItem => {
                            let [load, date] = dataItem;
                            if (load !== null) {
                                let dateLabel = new Date(date * 1000);
                                labelsArray.push(moment(dateLabel).format('HH:mm:ss'));
                                loadArray.push(load);
                                updatedLabels = labelsArray;
                                updatedDatasets[0].data = loadArray;
                            }
                        })
                    })
                })
                .then(data => {
                    this.setState({labels: updatedLabels, datasets: updatedDatasets})
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }

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
                                              className='dark-control' onChange={this.handleChange}>

                                    <option value='logic-test-01'>logic-test-01</option>


                                    <option value='logic-test-02'>logic-test-02</option>

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
        )
            ;


    }
}

export default App;

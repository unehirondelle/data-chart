import './App.css';
import moment from 'moment';
import React, {Component} from 'react';
import {Container, Row, Col, Form, InputGroup} from "react-bootstrap";
import Header from './components/header/header';
import CpuChart from "./components/cpu-chart/cpu-chart";
import MemoryChart from "./components/memory-chart/memory-chart";
import NetworkChart from "./components/network-chart/network-chart";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hostName: 'logic-test-01'
        };
        this.handleChange = this.handleChange.bind(this);
        this.eventhandler = this.eventhandler.bind(this);
    }

    handleChange(event) {
        this.setState({hostName: event.target.value});
    }

    eventhandler(data) {
        console.log(data);
    }

    componentDidMount() {
        let updatedState = {...this.state};
        let loadArray = [];
        let labelsArray = [];
        const {hostName} = this.state;
        const {metricName, chartName} = this.props;
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
            const {hostName, chartName} = this.state;
            const {metricName} = this.state.chartName;
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
                    <Row className='my-2'>
                        <Col xs={4}>
                            <InputGroup size='sm' className='hostSelector shadow'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="hostOptions"
                                                     className='dark-label'>Host</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control as='select' aria-label='Small' aria-describedby='hostOptions'
                                              className='dark-control' onChange={this.handleChange}>
                                    <option value='logic-test-01'>logic-test-01</option>
                                    <option value='logic-test-02'>logic-test-02</option>
                                </Form.Control>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs lg={8}>
                            <CpuChart hostName={this.state.hostName} onChange={this.eventhandler}/>
                        </Col>
                        <Col xs lg={4}>
                            <MemoryChart hostName={this.state.hostName} onChange={this.eventhandler}/>
                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col xs lg={8}>
                            <NetworkChart hostName={this.state.hostName} onChange={this.eventhandler}/>
                        </Col>
                    </Row>
                </Container>
                <footer className='fixed-bottom bg-dark text-center p-2'>
                    <small className='text-white'>Irina Plaksina &copy; 2020</small>
                </footer>
            </>
        );
    }
}

export default App;

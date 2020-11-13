import './App.css';
import React, {Component} from 'react';
import {Container, Row, Col, Form, InputGroup} from "react-bootstrap";
import Header from './components/header/header';
import CpuChart from "./components/cpu-chart/cpu-chart";
import MemoryChart from "./components/memory-chart/memory-chart";
import NetworkChart from "./components/network-chart/network-chart";

class App extends Component {

    state = {
        hostName: 'logic-test-01'
    };

    handleChange = (event) => {
        this.setState({hostName: event.target.value});
    }

    render() {
        return (
            <>
                <Header/>
                <Container className="App mb-5">
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
                            <CpuChart hostName={this.state.hostName}/>
                        </Col>
                        <Col xs lg={4}>
                            <MemoryChart hostName={this.state.hostName}/>
                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col xs lg={8}>
                            <NetworkChart hostName={this.state.hostName}/>
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

import moment from 'moment';
import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import {Button, ButtonGroup} from "react-bootstrap";

class NetworkChart extends Component {
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
                pointRadius: 0.5,
                data: []
            }
        ],
        metricName: 'eth0_txbyt',
        chartName: 'Linux_Network'
    }

    handleMetricChange = (event) => {
        this.setState({metricName: event.target.dataset.metric});
    };

    getData = () => {
        let updatedState = {...this.state};
        let loadArray = [];
        let labelsArray = [];
        const {chartName, metricName} = this.state;
        const hostName = this.props.hostName;
        fetch(`/data/${hostName}/${chartName}/${metricName}`)
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
    }

    componentDidMount() {
        this.getData();
    };

    componentDidUpdate(prevProps, prevState) {
        if ((prevProps.hostName !== this.props.hostName) || (prevState.chartName !== this.state.chartName) || (prevState.metricName !== this.state.metricName)) {
            this.getData();
        }
    }

    render() {
        return (
            <>
                <ButtonGroup size='sm' aria-label="networkData" className='shadow'
                             data-chart='Linux_Network'>
                    <Button variant="secondary" className='dark-button' data-metric='eth0_txbyt'
                            onClick={this.handleMetricChange}>eth0_txbyt</Button>
                    <Button variant="secondary" className='dark-button' data-metric='eth0_txerr'
                            onClick={this.handleMetricChange}>eth0_txerrs</Button>
                    <Button variant="secondary" className='dark-button' data-metric='eth0_rxbyt'
                            onClick={this.handleMetricChange}>eth0_rxbyt</Button>
                    <Button variant="secondary" className='dark-button' data-metric='eth0_rxerrs'
                            onClick={this.handleMetricChange}>eth0_rxerrs</Button>
                </ButtonGroup>
                <Line
                    data={this.state}
                    options={{
                        title: {
                            display: true,
                            text: 'Linux Network',
                            fontsize: 20,
                            fontFamily: "'Jura', sans-serif"
                        },
                        legend: {
                            display: false,
                            position: 'right'
                        },
                        layout: {
                            padding: {
                                left: 10,
                                right: 10,
                                top: 10,
                                bottom: 10
                            }
                        },
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    return data['datasets'][0]['data'][tooltipItem['index']] + 'bytes';
                                }
                            },
                            titleFontColor: 'rgba(94, 240, 50, 1)',
                            backgroundColor: 'transparent'
                        }
                    }}
                />
            </>
        )
    }
}

export default NetworkChart;
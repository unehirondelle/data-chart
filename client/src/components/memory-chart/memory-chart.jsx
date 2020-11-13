import moment from 'moment';
import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';
import {Button, ButtonGroup} from "react-bootstrap";

class MemoryChart extends Component {

    state = {
        labels: [],
        datasets: [
            {
                backgroundColor: 'rgba(94, 240, 50, 1)',
                data: []
            }
        ],
        metricName: 'Active',
        chartName: 'Linux_Memory'
    }

    handleChange = (event) => {
        this.setState({metricName: event.target.dataset.metric});
    };

    componentDidMount() {
        let updatedState = {...this.state};
        let loadArray = [];
        let labelsArray = [];
        const {chartName, metricName} = this.state;
        const hostName = this.props.hostName;
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
        if ((prevProps.hostName !== this.props.hostName) || (prevState.chartName !== this.state.chartName) || (prevState.metricName !== this.state.metricName)) {
            let updatedDatasets = [...this.state.datasets];
            let updatedLabels = [...this.state.labels];
            let loadArray = [];
            let labelsArray = [];
            const {chartName, metricName} = this.state;
            const hostName = this.props.hostName;
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
                <ButtonGroup size='sm' aria-label="memoryData" className='shadow' data-chart='Linux_Memory'
                             onClick={this.handleChange}>
                    <Button variant="secondary" className='dark-button' data-metric='Active'>Active</Button>
                    <Button variant="secondary" className='dark-button'
                            data-metric='MemUsed'>MemUsed</Button>
                    <Button variant="secondary" className='dark-button'
                            data-metric='MemCached'>MemCached</Button>
                    <Button variant="secondary" className='dark-button'
                            data-metric='SwapUsed'>SwapUsed</Button>
                    <Button variant="secondary" className='dark-button'
                            data-metric='SwapCached'>SwapCached</Button>
                </ButtonGroup>
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
            </>
        )
    }
}

export default MemoryChart;
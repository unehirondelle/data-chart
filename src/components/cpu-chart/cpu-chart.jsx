import moment from 'moment';
import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import {Button, ButtonGroup} from "react-bootstrap";

class CpuChart extends Component {

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
        metricName: 'idle',
        chartName: 'Linux_CPU'
    };

    handleChange = (event) => {
        this.setState({metricName: event.target.dataset.metric}, () => {
            if (this.props.onChange) {
                this.props.onChange(this.state);
            }
        });
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
                <ButtonGroup size='sm' aria-label="cpuData" className='shadow'
                >
                    <Button variant="secondary" className='dark-button'
                            data-metric='idle' data-chart='Linux_CPU'
                            onClick={this.handleChange}>idle</Button>
                    <Button variant="secondary" className='dark-button'
                            data-metric='user' data-chart='Linux_CPU'
                            onClick={this.handleChange}>user</Button>
                    <Button variant="secondary" className='dark-button'
                            data-metric='system' data-chart='Linux_CPU'
                            onClick={this.handleChange}>system</Button>
                    <Button variant="secondary" className='dark-button'
                            data-metric='iowait' data-chart='Linux_CPU'
                            onClick={this.handleChange}>iowait</Button>
                    <Button variant="secondary" className='dark-button'
                            data-metric='steal' data-chart='Linux_CPU'
                            onClick={this.handleChange}>steal</Button>
                </ButtonGroup>
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
                              },
                              xAxisID: 'date',
                              yAxisID: '%'
                          }
                      }}
                />
            </>
        )
    }
}

export default CpuChart;
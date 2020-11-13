import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';

class MemoryChart extends Component {

    state = {
        labels: ['Active', 'MemUsed', 'MemCached', 'SwapUsed', 'SwapCached'],
        datasets: [
            {
                backgroundColor: ['#7DA32A', '#6594F0', '#CDF081', '#F06248', '#A3857F'],
                data: []
            }
        ],
        chartName: 'Linux_Memory',
        canvasWidth: 500,
        canvasHeight: 400
    }

    handleChange = (event) => {
        this.setState({metricName: event.target.dataset.metric});
    };

    canvasRef = React.createRef();

    componentDidMount() {
        let updatedDatasets = [...this.state.datasets];
        let loadArray = [];
        const {chartName} = this.state;
        const metricName = `*`;
        const hostName = this.props.hostName;
        fetch(`/data/${hostName}/${chartName}/${metricName}`)
            .then(
                res => res.json()
            )
            .then(jsonStr => {
                jsonStr.map(i => {
                    if (i.target.includes("Active")) {
                        loadArray[0] = i.datapoints[0][0] || i.datapoints[1][0];
                        console.log('Active', i);
                        updatedDatasets[0].data = loadArray;
                    } else if (i.target.includes("MemUsed")) {
                        loadArray[1] = i.datapoints[0][0] || i.datapoints[1][0];
                        console.log('MemUsed', i);
                        updatedDatasets[0].data = loadArray;
                    } else if (i.target.includes("MemCached")) {
                        loadArray[2] = i.datapoints[0][0] || i.datapoints[1][0];
                        console.log('MemCached', i);
                        updatedDatasets[0].data = loadArray;
                    } else if (i.target.includes("SwapUsed")) {
                        loadArray[3] = i.datapoints[0][0] || i.datapoints[1][0];
                        console.log('SwapUsed', i);
                        updatedDatasets[0].data = loadArray;
                    } else if (i.target.includes("SwapCached")) {
                        loadArray[4] = i.datapoints[0][0] || i.datapoints[1][0];
                        console.log('SwapCached', i);
                        updatedDatasets[0].data = loadArray;
                    }
                })
            })
            .then(data => {
                this.setState({datasets: updatedDatasets})
            })
            .catch(function (err) {
                console.log(err);
            });
    };


    componentDidUpdate(prevProps, prevState) {
        if ((prevProps.hostName !== this.props.hostName) || (prevState.chartName !== this.state.chartName) || (prevState.metricName !== this.state.metricName)) {
            let updatedDatasets = [...this.state.datasets];
            let loadArray = [];
            const {chartName} = this.state;
            const metricName = `*`;
            const hostName = this.props.hostName;
            fetch(`/data/${hostName}/${chartName}/${metricName}`)
                .then(
                    res => res.json()
                )
                .then(jsonStr => {
                    jsonStr.map(i => {
                        if (i.target.includes("Active")) {
                            loadArray[0] = i.datapoints[0][0] || i.datapoints[1][0];
                            console.log('Active', i);
                            updatedDatasets[0].data = loadArray;
                        } else if (i.target.includes("MemUsed")) {
                            loadArray[1] = i.datapoints[0][0] || i.datapoints[1][0];
                            console.log('MemUsed', i);
                            updatedDatasets[0].data = loadArray;
                        } else if (i.target.includes("MemCached")) {
                            loadArray[2] = i.datapoints[0][0] || i.datapoints[1][0];
                            console.log('MemCached', i);
                            updatedDatasets[0].data = loadArray;
                        } else if (i.target.includes("SwapUsed")) {
                            loadArray[3] = i.datapoints[0][0] || i.datapoints[1][0];
                            console.log('SwapUsed', i);
                            updatedDatasets[0].data = loadArray;
                        } else if (i.target.includes("SwapCached")) {
                            loadArray[4] = i.datapoints[0][0] || i.datapoints[1][0];
                            console.log('SwapCached', i);
                            updatedDatasets[0].data = loadArray;
                        }
                    })
                })
                .then(data => {
                    this.setState({datasets: updatedDatasets})
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }

    render() {
        return (
            <>
                <Pie
                    ref={this.canvasRef}
                    width={this.state.canvasWidth}
                    height={this.state.canvasHeight}
                    data={this.state}
                    options={{
                        title: {
                            display: true,
                            text: 'Linux Memory',
                            fontsize: 20,
                            fontFamily: "'Jura', sans-serif"
                        },
                        legend: {
                            display: true,
                            position: 'right',
                            boxWidth: 10
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
                                    return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                                }
                            }
                        }
                    }}
                />
            </>
        )
    }
}

export default MemoryChart;
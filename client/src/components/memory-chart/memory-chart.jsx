import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';

class MemoryChart extends Component {

    state = {
        labels: [],
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

    getMemoryData = () => {
        let updatedState = {...this.state};
        let loadArray = [];
        let labelsArray = [];
        const {chartName} = this.state;
        const hostName = this.props.hostName;
        fetch(`/data/${hostName}/${chartName}/*`)
            .then(
                res => res.json()
            )
            .then(jsonStr => {
                jsonStr.map(i => {
                    i.datapoints.map(dataItem => {
                        let [load] = dataItem;
                        if (load !== null) {
                            const tokenStart = i.target.indexOf('.perfdata') + 10;
                            const tokenEnd = i.target.indexOf('.value');
                            const metricName = i.target.substring(tokenStart, tokenEnd);
                            if (labelsArray.indexOf(metricName) === -1) {
                                labelsArray.push(metricName);
                                loadArray.push(load);
                                updatedState.labels = labelsArray;
                                updatedState.datasets[0].data = loadArray;
                            }
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
        this.getMemoryData();
        console.log('component did mount')
    };


    componentDidUpdate(prevProps, prevState) {
        if ((prevProps.hostName !== this.props.hostName) || (prevState.chartName !== this.state.chartName) || (prevState.metricName !== this.state.metricName)) {
            this.getMemoryData();
            console.log('component did update')
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
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
                pointRadius: 0.5,
                data: []
            }
        ],
        metricName: 'idle',
        chartName: 'Linux_CPU'
    };

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
                <ButtonGroup size='sm' aria-label="cpuData" className='shadow'
                >
                    <Button variant="secondary"
                            className={this.state.metricName === 'idle' ? 'active dark-button' : 'dark-button'}
                            data-metric='idle' data-chart='Linux_CPU'
                            onClick={this.handleMetricChange}>idle</Button>
                    <Button variant="secondary"
                            className={this.state.metricName === 'user' ? 'active dark-button' : 'dark-button'}
                            data-metric='user' data-chart='Linux_CPU'
                            onClick={this.handleMetricChange}>user</Button>
                    <Button variant="secondary"
                            className={this.state.metricName === 'system' ? 'active dark-button' : 'dark-button'}
                            data-metric='system' data-chart='Linux_CPU'
                            onClick={this.handleMetricChange}>system</Button>
                    <Button variant="secondary"
                            className={this.state.metricName === 'iowait' ? 'active dark-button' : 'dark-button'}
                            data-metric='iowait' data-chart='Linux_CPU'
                            onClick={this.handleMetricChange}>iowait</Button>
                    <Button variant="secondary"
                            className={this.state.metricName === 'steal' ? 'active dark-button' : 'dark-button'}
                            data-metric='steal' data-chart='Linux_CPU'
                            onClick={this.handleMetricChange}>steal</Button>
                </ButtonGroup>
                <Line className='shadow'
                      data={this.state}
                      options={{
                          title: {
                              display: true,
                              text: 'Linux CPU',
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
                                      return data['datasets'][0]['data'][tooltipItem['index']] + '%';
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

export default CpuChart;
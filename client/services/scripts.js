import moment from "moment";

const handleLineChartDataChange = () => {
    let updatedDatasets = [...this.state.datasets];
    let updatedLabels = [...this.state.labels];
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

const handleChange = (event) => {
    this.setState({metricName: event.target.dataset.metric});
};

export default {handleChange, handleLineChartDataChange};
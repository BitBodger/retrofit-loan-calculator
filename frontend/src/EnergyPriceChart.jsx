import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import 'chartjs-plugin-dragdata';
import PropTypes from 'prop-types';

Chart.register(CategoryScale);

const EnergyPriceChart = React.forwardRef(({ scenarioData, onDataPointChange }, ref) => {
  const chartData = {
    labels: Array.from({ length: 40 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Energy Price Escalation',
        data: scenarioData,
        borderColor: '#FF0000',
        backgroundColor: '#FF0000',
        fill: false,
        borderWidth: 2,
        cubicInterpolationMode: 'monotone',
        tension: 0.9,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Year' },
        ticks: {
          autoSkip: false,
          callback: function (value, index) {
            return (index + 1) % 5 === 0 ? this.getLabelForValue(value) : '';
          }
        }
      },
      y: {
        min: 0,
        max: 6,
        title: { display: true, text: 'Energy Price Escalation (%)' },
      },
    },
    plugins: {
      legend: {
        labels: { usePointStyle: true, pointStyle: 'line' },
      },
      dragData: {
        round: 1,
        onDragEnd: (_e, _datasetIndex, index, value) => {
          onDataPointChange(index, value);
        },
      },
    },
  };

  return <Line ref={ref} data={chartData} options={options} />;
});

EnergyPriceChart.displayName = 'EnergyPriceChart';

EnergyPriceChart.propTypes = {
  scenarioData: PropTypes.array.isRequired,
  onDataPointChange: PropTypes.func.isRequired,
};

export default EnergyPriceChart;

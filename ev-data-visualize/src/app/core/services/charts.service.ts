import { Injectable } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  getBarChart(
    labels: string[],
    data: number[],
    chartLabel: string,
    xTitle: string,
    yTitle: string,
    backgroundColor: string = 'rgba(75, 192, 192, 0.2)',
    borderColor: string = 'rgba(75, 192, 192, 1)'
  ) {
    // Data to be used in the bar chart
    const barChartData: ChartData<'bar'> = {
      labels: labels,
      datasets: [
        {
          label: chartLabel,
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    };

    // Chart options, where you can set titles and other configurations
    const barChartOptions: ChartOptions<'bar'> = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: xTitle,
          },
        },
        y: {
          title: {
            display: true,
            text: yTitle,
          },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
        },
      },
    };

    return {
      data: barChartData,
      options: barChartOptions,
    };
  }

  getPieChart(data: number[], labels: string[], bgColors: string[]) {
    const pieChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: bgColors,
        },
      ],
    };

    const pieChartOptions = {};

    return {
      pieChartData,
      pieChartOptions,
    };
  }
}

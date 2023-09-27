import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  public dataSource = {
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#19fd28',
          '#19fddf',
          '#ee19fd'
        ],
      }
    ],
    labels: [] as string[],
  };

  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit(): void {
    if (this.dataService.isBudgetDataEmpty()) {
    this.dataService.getBudgetData().subscribe((res: any) => {
      this.dataSource.datasets[0].data = res.myBudget.map((item: any) => item.budget);
      this.dataSource.labels = res.myBudget.map((item: any) => item.title);
      this.createChart();
      this.createD3PieChart(res.myBudget);
    });
  }
  else {
    this.createChart();
    this.createD3PieChart(this.dataService.getChartData());
  }
}

  createChart() {
    console.log('Creating Chart');
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (ctx) {
      const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource,
      });
    }
  }

  createD3PieChart(data: { title: string; budget: number }[]): void {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal<string>()
      .range([
        '#ffcd56',
        '#ff6384',
        '#36a2eb',
        '#fd6b19',
        '#19fd28',
        '#19fddf',
        '#ee19fd'
      ]);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('padding', '10px')
      .style('background-color', 'white')
      .style('border', '1px solid #ccc')
      .style('border-radius', '4px');

    const svg = d3.select('#d3PieChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<{ title: string; budget: number }>().value((d) => d.budget);

    const arc = d3.arc<d3.PieArcDatum<{ title: string; budget: number }>>()
      .outerRadius(radius)
      .innerRadius(0);

    const arcGroup = svg.selectAll()
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .on('mouseover', function (event, d) {
        const x = event.pageX;
        const y = event.pageY;

        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);

        tooltip.html(`${d.data.title}: ${d.data.budget}`)
          .style('left', `${x + 5}px`)
          .style('top', `${y - 30}px`);
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    arcGroup.append('path')
      .attr('d', arc as any)
      .attr('fill', (d) => color(d.data.title));

    arcGroup.append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d as any)})`)
      .attr('dy', '.35em')
      .text((d) => d.data.title);
  }
}


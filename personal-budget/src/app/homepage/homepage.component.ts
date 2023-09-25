import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { AllKeys } from 'chart.js/dist/types/utils';


@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public dataSource = {
    datasets:[
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


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++ ) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
    }
    this.createChart();
    //createD3PieChart(res.data);

    });
  }

  createChart() {
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (ctx) {
      var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource,
      });
    }

  }

}





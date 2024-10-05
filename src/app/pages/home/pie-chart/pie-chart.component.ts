import {Component, Input, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from "chart.js";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input()
  pieChartData!: ChartData<'pie', number[], string | string[]>;

  pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  pieChartType: ChartType = 'pie';

  constructor(private router: Router) {
  }

  public chartClicked({event, active}: {event?: ChartEvent; active?: object[];}): void {
    // @ts-ignore
    const index: number = active![0].index;
    const countryName = this.pieChartData.labels![index]
    this.router.navigate(['detail', countryName])
  }
}

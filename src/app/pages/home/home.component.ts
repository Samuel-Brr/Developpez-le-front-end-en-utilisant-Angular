import {Component, OnInit} from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Country} from "../../core/models/Country";
import {ChartData} from "chart.js";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Country[]> = of([]);
  data: { name: string; value: number; }[] = [];
  pieChartData!: ChartData<'pie', number[], string | string[]>;
  numberOfJOs!: number;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.initPieChart();
  }

  private initPieChart() {
    this.olympics$.pipe(
      map(value => {
        let labels: string[] = [];
        let data: number[] = [];
        if (!!value) {
          this.numberOfJOs = value[0].participations.length;
          this.populateLabelsAndData(value, labels, data);
        }
        this.setPieChartData(labels, data);
      })
    ).subscribe()
  }

  private populateLabelsAndData(value: Country[], labels: string[], data: number[]) {
    value.forEach(country => {
      let medailles = 0;
      country.participations.forEach(participation => medailles = medailles + participation.medalsCount)
      labels.push(country.country);
      data.push(medailles)
    });
  }

  private setPieChartData(labels: string[], data: number[]) {
    this.pieChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#048E82', '#3D048E', '#8E0410', '#558E04', '#888E04'],
          hoverBackgroundColor: ['#05b8a8', '#713fb1', '#dc4652', '#a4f336', '#f7ff87']
        }
      ]
    };
  }
}

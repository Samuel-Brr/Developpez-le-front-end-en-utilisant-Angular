import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, of, Subscription} from 'rxjs';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Country} from "../../core/models/Country";
import {ChartData} from "chart.js";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<Country[]> = of([]);
  pieChartData!: ChartData<'pie', number[], string | string[]>;
  numberOfJOs!: number;

  private subscription!: Subscription;

  constructor(private olympicService: OlympicService) {
  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.initPieChart();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initPieChart(): void {
    this.subscription = this.olympics$.pipe(
      map(countries => {
        let labels: string[] = [];
        let medals: number[] = [];
        if (!!countries) {
          this.numberOfJOs = countries[0].participations.length;
          this.populateLabelsAndData(countries, labels, medals);
          this.setPieChartData(labels, medals);
        }
      })
    ).subscribe()
  }

  private populateLabelsAndData(countries: Country[], labels: string[], medals: number[]) {
    countries.forEach(country => {
      let totalMedals: number = 0;
      country.participations.forEach(participation => totalMedals = totalMedals + participation.medalsCount)
      labels.push(country.name);
      medals.push(totalMedals)
    });
  }

  private setPieChartData(labels: string[], medals: number[]) {
    this.pieChartData = {
      labels,
      datasets: [
        {
          data: medals,
          backgroundColor: ['#048E82', '#3D048E', '#8E0410', '#558E04', '#888E04'],
          hoverBackgroundColor: ['#05b8a8', '#713fb1', '#dc4652', '#a4f336', '#f7ff87']
        }
      ]
    };
  }
}

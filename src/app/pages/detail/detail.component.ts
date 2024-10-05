import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OlympicService} from "../../core/services/olympic.service";
import {filter, map} from "rxjs";
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {Country} from "../../core/models/Country";
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartType, LogarithmicScale} from "chart.js";

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    JsonPipe,
    BaseChartDirective,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  lineChartType: ChartType = 'line';
  lineChartData!: ChartConfiguration['data'];
  lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      },
    },

    plugins: {
      legend: { display: true },
    },
  };

  countryName!: string;
  countryData!: Country;
  totalMedals!: number;
  totalAthletes!: number;
  isCountryPresent!: boolean;

  constructor(private route: ActivatedRoute, private olympicService: OlympicService, private router: Router) {
  }

  ngOnInit() {
    this.setCountryName();
    this.initPageData();
  }

  private initPageData() {
    this.olympicService.getOlympics()
      .pipe(
        map(countries => {
          if (!!countries) {
            let countryOptionnal = countries.filter(country => country.country == this.countryName);
            if (countryOptionnal.length == 0) {
              this.isCountryPresent = false
            } else {
              this.isCountryPresent = true
              this.countryData = countries[0];
              this.initLineChartData();
              this.initTotalMedals();
              this.initTotalAthletes();
            }
          }
        })
      )
      .subscribe()
  }

  private setCountryName() {
    this.route.params.subscribe(params => {
      this.countryName = params['countryName'];
    });
  }

  private initLineChartData(){
    this.lineChartData = {
      datasets: [
        {
          data:  this.countryData.participations.map(participation => participation.medalsCount),
          label: this.countryName,
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        }
      ],
      labels: this.countryData.participations.map(participation => participation.year),
    };
  }

  private initTotalMedals(){
    let medals = 0;
    this.countryData.participations.forEach(participation =>  medals = medals + participation.medalsCount);
    this.totalMedals = medals;
  }

  private initTotalAthletes(){
    let athletes = 0;
    this.countryData.participations.forEach(participation =>  athletes = athletes + participation.athleteCount);
    this.totalAthletes = athletes;
  }

  public onBack(){
    this.router.navigate([""]);
  }
}

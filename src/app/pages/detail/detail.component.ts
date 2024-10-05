import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OlympicService} from "../../core/services/olympic.service";
import {map, Subscription} from "rxjs";
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {Country} from "../../core/models/Country";
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartType} from "chart.js";

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
export class DetailComponent implements OnInit, OnDestroy {
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
      legend: {display: true},
    },
  };

  countryName!: string;
  countryData!: Country;
  totalMedals!: number;
  totalAthletes!: number;
  isCountryPresent!: boolean;

  private subscription!: Subscription;

  constructor(private route: ActivatedRoute, private olympicService: OlympicService, private router: Router) {
  }

  ngOnInit(): void {
    this.setCountryName();
    this.initPageData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initPageData(): void {
    this.subscription = this.olympicService.getOlympics()
      .pipe(
        map(countries => {
          if (!!countries) {
            let countryOptionnal: Country | undefined = countries.find(country => country.name == this.countryName);
            if (!countryOptionnal) {
              this.isCountryPresent = false
            } else {
              this.isCountryPresent = true
              this.countryData = countryOptionnal;
              this.initLineChartData();
              this.initTotalMedals();
              this.initTotalAthletes();
            }
          }
        })
      )
      .subscribe()
  }

  private setCountryName(): void {
    this.route.params.subscribe(params => {
      this.countryName = params['countryName'];
    });
  }

  private initLineChartData(): void {
    this.lineChartData = {
      datasets: [
        {
          data: this.countryData.participations.map(participation => participation.medalsCount),
          label: this.countryName,
          backgroundColor: 'rgba(255,255,255,0)',
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

  private initTotalMedals(): void {
    let medals = 0;
    this.countryData.participations.forEach(participation => medals = medals + participation.medalsCount);
    this.totalMedals = medals;
  }

  private initTotalAthletes(): void {
    let athletes = 0;
    this.countryData.participations.forEach(participation => athletes = athletes + participation.athleteCount);
    this.totalAthletes = athletes;
  }

  public onBack(): void {
    this.router.navigate([""]);
  }
}

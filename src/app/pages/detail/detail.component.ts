import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OlympicService} from "../../core/services/olympic.service";
import {map, Subscription} from "rxjs";
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {Country} from "../../core/models/Country";
import {BaseChartDirective} from "ng2-charts";
import {LineChartModule} from "@swimlane/ngx-charts";

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    JsonPipe,
    BaseChartDirective,
    AsyncPipe,
    NgIf,
    LineChartModule
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {

  // Line chart options
  lineChartData!: {name: string, series:{name: string, value: number}[]}[];
  legend: boolean = false;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  timeline: boolean = true;

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
    this.lineChartData = [{
      name: this.countryName,
      series: this.countryData.participations.map(participation => {
        return {name: participation.year.toString(), value: participation.medalsCount}
      })
    }]
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

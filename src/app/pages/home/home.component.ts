import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {map, Observable, of, Subscription} from 'rxjs';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Country} from "../../core/models/Country";
import {Color, ScaleType} from "@swimlane/ngx-charts";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('tooltipTemplate', { static: true }) tooltipTemplate!: ElementRef;
  olympics$: Observable<Country[]> = of([]);
  numberOfJOs!: number;
  private subscription!: Subscription;

  // Pie chart options
  chartData!:{name: string, value: number}[];
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  colorScheme: Color = {
    name: "toto",
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#946065', '#b7cae6', '#88a0da','#783d52', '#967fa0']
  };

  constructor(private olympicService: OlympicService, private router: Router) {
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
        if (!!countries) {
          this.numberOfJOs = countries[0].participations.length;
          this.chartData = this.generateChartData(countries);
        }
      })
    ).subscribe()
  }

  private generateChartData(countries: Country[]) {
    const newSingle:{name: string, value: number}[] = []
    countries.forEach(country => {
      let totalMedals: number = 0;
      country.participations.forEach(participation => totalMedals = totalMedals + participation.medalsCount)
      newSingle.push({name: country.name, value: totalMedals})
    });
    return newSingle;
  }

  onSelect(data: {name: string, value: number, label: string}): void {
    this.router.navigate(['detail', data.name])
  }

  formatTooltipText(data: any): string {
    return `
      <span class="tooltip-label">${data.data.name}</span>
      <span class="tooltip-val"><img src="../../../assets/gold-medal_522484.png" width="15px">${data.value.toLocaleString()}</span>
    `;
  }
}

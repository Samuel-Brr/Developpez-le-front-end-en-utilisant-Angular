import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Country} from "../models/Country";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient, private router: Router) {
  }

  loadInitialData(): Observable<Country[]> {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next(null);
        this.router.navigate(['loading_error'])
        return caught;
      })
    );
  }

  getOlympics(): Observable<Country[]> {
    return this.olympics$.asObservable();
  }
}

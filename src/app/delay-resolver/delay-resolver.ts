import {Injectable} from '@angular/core';
import {Resolve} from "@angular/router";
import {delay, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DelayResolver implements Resolve<boolean> {
  resolve(): Observable<boolean> {
    // Delay for 2 seconds
    return of(true).pipe(delay(2000));
  }
}

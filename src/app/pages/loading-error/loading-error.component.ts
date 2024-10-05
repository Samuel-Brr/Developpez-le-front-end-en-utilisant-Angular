import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-loading-error',
  standalone: true,
    imports: [
        RouterLink
    ],
  templateUrl: './loading-error.component.html',
  styleUrl: './loading-error.component.scss'
})
export class LoadingErrorComponent {

}

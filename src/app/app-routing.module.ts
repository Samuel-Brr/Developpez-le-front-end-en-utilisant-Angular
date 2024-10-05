import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import {DetailComponent} from "./pages/detail/detail.component";
import {DelayResolver} from "./delay-resolver/delay-resolver";
import {LoadingErrorComponent} from "./pages/loading-error/loading-error.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path:'detail/:countryName',
    component: DetailComponent,
    resolve: {delay: DelayResolver} // Used to showcase loading screen. SHOULD NOT BE USED IN PRODUCTION.
  },
  {
    path: 'loading_error',
    component: LoadingErrorComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

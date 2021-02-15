import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CountryComponent} from './country/country.component';

const routes: Routes = [
  {path: 'country', component: CountryComponent},
  {path: '', component: CountryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

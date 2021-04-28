import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Rwa01Page } from './rwa01.page';

const routes: Routes = [
  {
    path: '',
    component: Rwa01Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Rwa01PageRoutingModule {}

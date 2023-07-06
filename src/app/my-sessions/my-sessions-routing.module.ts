import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MySessionsPage } from './my-sessions.page';

const routes: Routes = [
  {
    path: '',
    component: MySessionsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MySessionsPageRoutingModule {}

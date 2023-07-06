import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionDetailsComponent } from './session-details.component';

const routes: Routes = [
  {
    path: '',
    component: SessionDetailsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionDetailRoutingModule {}

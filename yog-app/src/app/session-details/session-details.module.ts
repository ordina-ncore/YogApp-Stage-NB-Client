import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionDetailsComponent } from './session-details.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SessionDetailRoutingModule } from './session-details-routing.module';
import { SessionDetailsViewComponent } from './session-details-view/session-details-view.component';



@NgModule({
  declarations: [SessionDetailsComponent, SessionDetailsViewComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SessionDetailRoutingModule
  ],
})
export class SessionDetailsModule { }

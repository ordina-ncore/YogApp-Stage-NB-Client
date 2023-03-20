import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpcomingSessionsPage } from './upcoming-sessions.page';

import { UpcomingSessionsPageRoutingModule } from './upcoming-sessions-routing.module';
import { UpcomingSessionsViewComponent } from './upcoming-sessions-view/upcoming-sessions-view.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    UpcomingSessionsPageRoutingModule
  ],
  declarations: [UpcomingSessionsPage, UpcomingSessionsViewComponent]
})
export class UpcomingSessionsPageModule {}

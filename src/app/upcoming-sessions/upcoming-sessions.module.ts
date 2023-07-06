import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpcomingSessionsPage } from './upcoming-sessions.page';

import { UpcomingSessionsPageRoutingModule } from './upcoming-sessions-routing.module';
import { UpcomingSessionsViewComponent } from './upcoming-sessions-view/upcoming-sessions-view.component';
import { ProfilePageModule } from '../profile/profile.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    UpcomingSessionsPageRoutingModule,
    ProfilePageModule,
    TranslateModule
  ],
  declarations: [UpcomingSessionsPage, UpcomingSessionsViewComponent]
})
export class UpcomingSessionsPageModule {}

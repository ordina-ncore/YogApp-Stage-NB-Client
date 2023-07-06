import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomDetailsPageRoutingModule } from './room-details-routing.module';

import { RoomDetailsPage } from './room-details.page';
import { RoomDetailsViewComponent } from './room-details-view/room-details-view.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomDetailsPageRoutingModule,
    TranslateModule
  ],
  declarations: [RoomDetailsPage, RoomDetailsViewComponent]
})
export class RoomDetailsPageModule {}

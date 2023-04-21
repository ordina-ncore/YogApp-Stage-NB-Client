import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRoomPageRoutingModule } from './edit-room-routing.module';

import { EditRoomPage } from './edit-room.page';
import { EditRoomViewComponent } from './edit-room-view/edit-room-view.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditRoomPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [EditRoomPage, EditRoomViewComponent]
})
export class EditRoomPageModule {}

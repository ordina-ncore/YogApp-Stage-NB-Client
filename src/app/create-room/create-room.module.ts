import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateRoomPageRoutingModule } from './create-room-routing.module';

import { CreateRoomPage } from './create-room.page';
import { CreateRoomViewComponent } from './create-room-view/create-room-view.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateRoomPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [CreateRoomPage, CreateRoomViewComponent]
})
export class CreateRoomPageModule {}

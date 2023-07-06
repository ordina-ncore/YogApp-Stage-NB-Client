import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateSessionPageRoutingModule } from './create-session-routing.module';

import { CreateSessionPage } from './create-session.page';
import { CreateSessionViewComponent } from './create-session-view/create-session-view.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule ,
    ReactiveFormsModule,
    IonicModule,
    CreateSessionPageRoutingModule,
    TranslateModule
  ],
  declarations: [CreateSessionPage, CreateSessionViewComponent]
})
export class CreateSessionPageModule {}

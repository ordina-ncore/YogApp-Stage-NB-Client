import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSessionPageRoutingModule } from './edit-session-routing.module';

import { EditSessionPage } from './edit-session.page';
import { EditSessionViewComponent } from './edit-session-view/edit-session-view.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditSessionPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [EditSessionPage, EditSessionViewComponent],
})
export class EditSessionPageModule {}

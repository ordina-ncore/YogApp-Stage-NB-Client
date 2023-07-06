import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MySessionsPage } from './my-sessions.page';

import { MySessionsPageRoutingModule } from './my-sessions-routing.module';
import { MySessionsViewComponent } from './my-sessions-view/my-sessions-view.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MySessionsPageRoutingModule,
    TranslateModule
  ],
  declarations: [MySessionsPage, MySessionsViewComponent]
})
export class MySessionsPageModule {}

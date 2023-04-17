import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/models';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent implements OnInit {
  @Input() user: User | null = {};
  @Input() selectedTheme!: string | null;
  @Output() btnLogoutPushed = new EventEmitter<boolean>();
  @Output() btnDarkToggle = new EventEmitter();

  constructor(private translateService: TranslateService) {}

  ngOnInit() {}

  changeLanguage(event: any) {
    console.log(event.detail.value)
    this.translateService.use(event.detail.value);
  }


  logOut() {
    this.btnLogoutPushed.emit(true);
  }
  onDarkModeChecked(){
    this.btnDarkToggle.emit();
  }
}

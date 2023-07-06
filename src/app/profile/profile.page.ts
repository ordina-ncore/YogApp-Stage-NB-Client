import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/models';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User | null = {};
  selectedTheme!: string | null;


  constructor(
    private msalService: MsalService,
    public alertController: AlertController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.user = this.RetrieveLoggedInUserFromLocalStorage();
    let savedTheme = localStorage.getItem('colorTheme');
    if(!savedTheme){
      this.selectedTheme = 'light'
      localStorage.setItem('colorTheme', 'light');
    }
    else{
      document.body.setAttribute('color-theme', savedTheme);
      this.selectedTheme = savedTheme
    }
  }
  setTheme() {
    let storageItem: string | null = localStorage.getItem('colorTheme');
    if (storageItem) {
      let theme: string = storageItem;
      if (theme === 'light') {
        document.body.setAttribute('color-theme', 'dark');
        localStorage.setItem('colorTheme', 'dark');
      }
      if (theme === 'dark') {
        document.body.setAttribute('color-theme', 'light');
        localStorage.setItem('colorTheme', 'light');
      }
    }
  }

  RetrieveLoggedInUserFromLocalStorage(): User | null {
    const loggedInUserString: string | null =
      localStorage.getItem('currentUser');
    if (loggedInUserString === null) return null;
    const loggedInUser: User = JSON.parse(loggedInUserString);
    return loggedInUser;
  }

  async logOut(btnClicked: boolean) {
    const alert = await this.alertController.create({
      header: this.translate.instant('confirmation'),
      message: this.translate.instant('sure_log_out'),
      buttons: [
        {
          text: this.translate.instant('no'),
          role: this.translate.instant('cancel'),
          handler: () => {},
        },
        {
          text: this.translate.instant('yes'),
          handler: () => {
            var msalInstance = this.msalService.instance;
            msalInstance.logout();
          },
        },
      ],
    });

    if (btnClicked) {
      await alert.present();
    }
  }
}

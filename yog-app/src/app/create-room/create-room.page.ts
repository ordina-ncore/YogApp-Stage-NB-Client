import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { CreateRoomInput, Room } from 'src/models';
import { ToasterService } from '../shared/services/toaster.service';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.page.html',
  styleUrls: ['./create-room.page.scss'],
})
export class CreateRoomPage implements OnInit {

  constructor(
    private apollo: Apollo,
    private loadingCtrl: LoadingController,
    private router: Router,
    private toasterService: ToasterService,
    private translate: TranslateService
    ) { }

  ngOnInit() {
  }

  async receiveCreatedRoom(room: CreateRoomInput){
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('creating_room'),
    });
    await loading.present();
    this.mutationCreateRoom(room).subscribe(
      (result) => {
        this.router.navigate(['tabs/rooms']);
        loading.dismiss();
      },
      (error) => {
        loading.dismiss();
        this.toasterService.presentToast('top', error.message, 1500);
      }
    );

  }
  mutationCreateRoom(roomInput: CreateRoomInput): Observable<Room> {
    const mutation = gql`
      mutation CreateRoom($input: CreateRoomInput!) {
        createRoom(input: $input) {
          id
        }
      }
    `;
    return this.apollo
      .mutate<{ createRoom: Room }>({
        mutation,
        variables: {
          input: roomInput,
        },
      })
      .pipe(map((result: any) => result.data.createSession));
  }

}

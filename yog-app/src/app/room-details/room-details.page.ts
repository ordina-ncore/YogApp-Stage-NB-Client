import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Room } from 'src/models';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.page.html',
  styleUrls: ['./room-details.page.scss'],
})
export class RoomDetailsPage implements OnInit {
  room$: Observable<Room | null | undefined> | null | undefined;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private loadingCtrl: LoadingController,
    public alertController: AlertController,
    private router: Router,
    private translate: TranslateService
  ) {
    if (this.route.snapshot.params['id']) {
      let receivedId: string = this.route.snapshot.params['id'];
      this.fetchRoomDetails(receivedId);
    }
  }

  ionViewWillEnter() {
    let receivedId: string = this.route.snapshot.params['id'];
    this.fetchRoomDetails(receivedId);
  }

  async fetchRoomDetails(receivedId: string) {
    const loading = await this.loadingCtrl.create({
        message: this.translate.instant('fetching_room_details'),
    });

    await loading.present();

    const GET_ROOM_BY_ID = gql`
        query GetRoomById($id: UUID!) {
            room(id: $id) {
                id
                name
                capacity
                address
                description
            }
        }
    `;

    // Fetch session details using a GraphQL query
    this.room$ = this.apollo.watchQuery({
        query: GET_ROOM_BY_ID,
        variables: {
            id: receivedId,
        },
        fetchPolicy: 'cache-and-network',
    }).valueChanges.pipe(
        map((x: any) => {
            return x.data?.room;
        })
    );

    // Dismiss loading indicator when session details have been fetched
    this.room$.subscribe({
        next: () => {
            loading.dismiss();
        },
        error: (error: any) => {
            console.error(error);
            loading.dismiss();
        },
    });
}

  ngOnInit() {
  }

  async btnRemoveClicked(){
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('removing_room'),
    });

    const alert = await this.alertController.create({
      header: this.translate.instant('confirmation'),
      message:this.translate.instant('sure_remove_room'),
      buttons: [
        {
          text: this.translate.instant('no'),
          role: 'cancel',
          handler: () => {},
        },
        {
          text: this.translate.instant('yes'),
          handler: () => {
            loading.present();
            if (this.room$) {
              this.room$.subscribe((room) => {

                if (room && room.id) {
                  this.removeRoom(room.id).subscribe((room) => {
                    if (room?.isDeleted) {
                      loading.dismiss();
                      this.router.navigate(['tabs/rooms']);
                    }
                  });
                }
              });
            }
          },
        },
      ],
    });
    alert.present();
  }

  removeRoom(roomId: string): Observable<Room | null | undefined> {
    const mutation = gql`
      mutation RemoveRoom($roomId: UUID!) {
        removeRoom(roomId: $roomId) {
          id
          isDeleted
        }
      }
    `;
    return this.apollo
      .mutate<{ cancelledRoom: Room }>({
        mutation,
        variables: {
          roomId: roomId,
        },
      })
      .pipe(
        map((result: any) => {
          return result.data.removeRoom;
        })
      );
  }
}



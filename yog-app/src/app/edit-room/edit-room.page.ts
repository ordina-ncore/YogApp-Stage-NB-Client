import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Apollo, gql } from 'apollo-angular';
import { ToasterService } from '../shared/services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { CreateRoomInput, EditRoomInput, Room } from 'src/models';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.page.html',
  styleUrls: ['./edit-room.page.scss'],
})
export class EditRoomPage implements OnInit {
  room$: Observable<Room | null | undefined> | null | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private loadingCtrl: LoadingController,
    private toasterService: ToasterService,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    if (this.route.snapshot.params['id']) {
      let receivedId: string = this.route.snapshot.params['id'];
      this.fetchRoomDetails(receivedId);
    }
  }

  async receiveEditedRoom(editedRoomInput: EditRoomInput) {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('updating_room'),
    });
    await loading.present();
    this.mutationEditRoom(editedRoomInput).subscribe(
      (result) => {
        loading.dismiss();
        this.router.navigate(['tabs/room-details', result.id]);
      },
      (error) => {
        loading.dismiss();
        this.toasterService.presentToast('top', this.translate.instant(error?.networkError.error.errors[0].message), 2000);
      }
    );
  }

  mutationEditRoom(roomInput: EditRoomInput): Observable<Room> {
    const mutation = gql`
      mutation EditRoom($input: EditRoomInput!) {
        editRoom(input: $input) {
          id
        }
      }
    `;
    return this.apollo
      .mutate<{ editRoom: Room }>({
        mutation,
        variables: {
          input: roomInput,
        },
      })
      .pipe(map((result: any) => result.data.editRoom));
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
             if(this.room$)loading.dismiss();
        },
        error: (error: any) => {
            console.error(error);
            loading.dismiss();
        },
    });
}
}

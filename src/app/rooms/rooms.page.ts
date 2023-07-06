import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Room } from 'src/models';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {
  rooms$: Observable<Room[] | null | undefined> | null | undefined;

  constructor(private loadingCtrl: LoadingController, private translate: TranslateService, private apollo: Apollo) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('fetching_rooms'),
    });
    await loading.present();
    this.rooms$ = this.queryRooms();
    loading.dismiss();
  }

  async ionViewWillEnter() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('fetching_rooms'),
    });
    await loading.present();
    this.rooms$ = this.queryRooms();
    loading.dismiss();
  }

  queryRooms(): Observable<Room[] | null | undefined> {
    return this.apollo
      .watchQuery({
        query: gql`
        query{
          rooms(
            where: {
              isDeleted: { eq: false }
            }
          ) {

            nodes{
              id,
              name,
              address,
              capacity
            }
          }
      }
        `,
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(
        map((x: any) => {
          return x.data?.rooms.nodes;
        })
      );
  }


}

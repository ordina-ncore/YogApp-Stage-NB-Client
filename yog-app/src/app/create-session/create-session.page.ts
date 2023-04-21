import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, of, tap } from 'rxjs';
import { CreateSessionInput, Room, Session, User } from 'src/models';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToasterService } from '../shared/services/toaster.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.page.html',
  styleUrls: ['./create-session.page.scss'],
})
export class CreateSessionPage implements OnInit {
  rooms$: Observable<Room[] | null | undefined> | null | undefined;
  teachers$: Observable<User[] | null | undefined> | null | undefined;
  constructor(
    private apollo: Apollo,
    private loadingCtrl: LoadingController,
    private router: Router,
    private toasterService: ToasterService,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('fetching_data'),
    });
    await loading.present();
    this.queryRooms().subscribe((rooms) => {
      if (rooms) {
        this.rooms$ = of(rooms); // convert to observable
        this.queryTeachers().subscribe((teachers) => {
          if (teachers) {
            this.teachers$ = of(teachers); // convert to observable
            loading.dismiss();
          }
        })
      }
    })
  }

  //METHODS
  async receiveCreatedRoom(createdSessionInput: CreateSessionInput) {
    // Show loading animation
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('creating_session'),
    });
    await loading.present();

    this.mutationCreateSession(createdSessionInput).subscribe(
      (result) => {
        this.router.navigate(['tabs/upcoming-sessions']);
        loading.dismiss();
      },
      (error) => {
        loading.dismiss();
        this.toasterService.presentToast('top', error.message, 1500);
      }
    );
  }

  queryRooms() {
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
      })
      .valueChanges.pipe(map((x: any) => x.data?.rooms.nodes));
  }
  queryTeachers() {
    return this.apollo
      .watchQuery({
        query: gql`
          {
            teachers {
                azureId
                firstName
                lastName
            }
          }
        `,
      })
      .valueChanges.pipe(map((x: any) => x.data?.teachers));
  }

  mutationCreateSession(sessionInput: CreateSessionInput): Observable<Session> {
    const mutation = gql`
      mutation CreateSession($input: CreateSessionInput!) {
        createSession(input: $input) {
          id
        }
      }
    `;
    return this.apollo
      .mutate<{ createSession: Session }>({
        mutation,
        variables: {
          input: sessionInput,
        },
      })
      .pipe(map((result: any) => result.data.createSession));
  }
}

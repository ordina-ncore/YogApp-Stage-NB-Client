import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, of } from 'rxjs';
import { Room, Session } from 'src/models';
import { UpcomingSessionsPage } from '../upcoming-sessions/upcoming-sessions.page';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss'],
})
export class SessionDetailsComponent implements OnInit {
  session$: Observable<Session | null | undefined> | null | undefined;
  isLoading = false;
  rooms$: Observable<Room[] | null | undefined> | null | undefined;

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
      this.fetchSessionDetails(receivedId);
    }
  }

  ngOnInit() {}

  ionViewWillEnter() {
    let receivedId: string = this.route.snapshot.params['id'];
    this.fetchSessionDetails(receivedId);
  }
  btnEditClicked(id: string) {
    console.log('clicked');
    this.router.navigate(['tabs/edit-session', id]);
  }

  async btnCancelClicked() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('cancelling_session'),
    });

    const alert = await this.alertController.create({
      header: this.translate.instant('confirmation'),
      message:this.translate.instant('sure_cancel_session'),
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
            if (this.session$) {
              this.session$.subscribe((session) => {
                if (session && session.id) {
                  this.cancelSession(session.id).subscribe((session) => {
                    if (session?.isCancelled) {
                      loading.dismiss();
                      this.router.navigate(['tabs/upcoming-sessions']);
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

  async fetchSessionDetails(receivedId: string) {
    const loading = await this.loadingCtrl.create({
        message: this.translate.instant('fetching_sessions_details'),
    });

    await loading.present();

    const GET_SESSION_BY_ID = gql`
        query GetSessionById($id: UUID!) {
            session(id: $id) {
                id
                title
                startDateTime
                endDateTime
                capacity
                teacher {
                    azureId
                    firstName
                    lastName
                    profilePicture
                }
                timeStampAdded
                isCancelled
                isFull
                room {
                    id
                    name
                    address
                    capacity
                }
                participants {
                    id
                    matNumber
                    timeStampSignUp
                    hasCancelled
                    user {
                        azureId
                        firstName
                        lastName
                        profilePicture
                    }
                }
            }
        }
    `;

    // Fetch session details using a GraphQL query
    this.session$ = this.apollo.watchQuery({
        query: GET_SESSION_BY_ID,
        variables: {
            id: receivedId,
        },
        fetchPolicy: 'cache-and-network',
    }).valueChanges.pipe(
        map((x: any) => {
            this.isLoading = x.loading;
            return x.data?.session;
        })
    );



    // Dismiss loading indicator when session details have been fetched
    this.session$.subscribe({
        next: () => {
            loading.dismiss();
        },
        error: (error: any) => {
            console.error(error);
            loading.dismiss();
        },
    });
}

  queryRooms(): Observable<Room[] | null | undefined> {
    return this.apollo
      .watchQuery({
        query: gql`
          {
            rooms {
              nodes {
                id
                name
                address
                capacity
              }
            }
          }
        `,
      })
      .valueChanges.pipe(map((x: any) => x.data?.rooms.nodes));
  }

  cancelSession(sessionId: string): Observable<Session | null | undefined> {
    const mutation = gql`
      mutation CancelSession($sessionId: UUID!) {
        cancelSession(sessionId: $sessionId) {
          id
          isCancelled
          isFull
        }
      }
    `;
    return this.apollo
      .mutate<{ cancelledSession: Session }>({
        mutation,
        variables: {
          sessionId: sessionId,
        },
      })
      .pipe(
        map((result: any) => {
          return result.data.cancelSession;
        })
      );
  }
}

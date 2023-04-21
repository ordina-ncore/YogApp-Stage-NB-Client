import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Apollo, gql } from 'apollo-angular';
import { lastValueFrom, map, Observable, of, switchMap } from 'rxjs';
import { Session, User } from 'src/models';

@Component({
  selector: 'app-upcoming-sessions',
  templateUrl: 'upcoming-sessions.page.html',
  styleUrls: ['upcoming-sessions.page.scss'],
})
export class UpcomingSessionsPage implements OnInit {
  [x: string]: any;
  sessions$: Observable<Session[] | null | undefined> | null | undefined;
  currentUser: User | undefined;
  isLoading = false;
  showLoader = false;
  userProfilePic: string | undefined =
    'https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU=';

  constructor(
    private apollo: Apollo,
    private router: Router,
    private navController: NavController,
    private loadingCtrl: LoadingController,
    private msalService: MsalService,
    private translate: TranslateService
  ) {}

  handleRefresh() {
    this.fetchSessionsWithLoader();
  }
  ionViewWillEnter() {
    this.fetchSessionsWithLoader();
  }

  async ngOnInit() {
    var instance = this.msalService.instance;

    if (
      instance.getActiveAccount() != null
      // && localStorage.getItem('currentUser') === null
    ) {
      const loading = await this.loadingCtrl.create({
        message: this.translate.instant('logging_in'),
      });

      await loading.present();
      var azureId: string | undefined;
      azureId = instance.getActiveAccount()?.localAccountId;
      if (azureId) {
        this.getMe(azureId).subscribe((user) => {
          loading.message = this.translate.instant('fetching_profile');
          //get role from loggedin user bearer token
          const bearer: string | null = localStorage.getItem('bearerToken');
          if (bearer) {
            user.role = JSON.parse(atob(bearer.split('.')[1])).roles[0];
          }
          this.addUserToLocalStorage(user);
          this.userProfilePic = user.profilePicture;
          loading.message = this.translate.instant('fetching_upcoming_sessions');
          this.fetchSessionsWithLoader();
          loading.dismiss();
        });
      }
    }
    if (
      instance.getActiveAccount() != null &&
      localStorage.getItem('currentUser') != null
    ) {
      const user: User | null = JSON.parse(
        localStorage.getItem('currentUser') || 'null'
      );
      this.userProfilePic = user?.profilePicture;
    }
  }

  addUserToLocalStorage(user: User) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  async fetchSessionsWithLoader() {
    //await loading.present();
    this.showLoader = true;
    this.sessions$ = this.queryUpcomingSessions();
    const subscription = this.sessions$.subscribe({
      next: () => {
        this.showLoader = false;
        subscription.unsubscribe();
      },
      error: () => {
        this.showLoader = false;
        subscription.unsubscribe();
      },
    });
  }

  onBtnShowSessionsDetailsClicked(sessionId: string) {
    this.router.navigate(['tabs/session-details', sessionId]);
  }
  onBtnCreateNewSessionClicked() {
    this.router.navigate(['tabs/create-session']);
  }
  onBtnRoomsClicked(){
    this.router.navigate(['tabs/rooms']);
  }
  queryUpcomingSessions(): Observable<Session[] | null | undefined> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getUpcomingSessions($currentDateTime: DateTime!) {
            sessions(
              first: 25
              where: {
                startDateTime: { gt: $currentDateTime }
                isCancelled: { eq: false }
              }
              order: { startDateTime: ASC }
            ) {
              nodes {
                id
                title
                capacity
                startDateTime
                endDateTime
                participants {
                  id
                }
                teacher {
                  azureId
                  firstName
                  lastName
                }
                room {
                  name
                  address
                }
              }
            }
          }
        `,
        variables: {
          currentDateTime: new Date().toISOString(),
        },
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(
        map((x: any) => {
          this.isLoading = x.loading;
          return x.data?.sessions.nodes;
        })
      );
  }

  async getToken() {
    var data = await lastValueFrom(
      this.msalService.acquireTokenSilent({
        scopes: ['api://9eba4a57-7daa-473b-8efb-5a0e6e96ca6c/access_all'],
      })
    );

    return 'Bearer ' + data;
  }

  retrieveUserFromDbWithAzureId(azureId: string): Observable<User | null> {
    const GET_USER_BY_AZUREID = gql`
      query GetUserByAzureId($azureId: String!) {
        userByAzureId(azureId: $azureId) {
          azureId
          firstName
          lastName
          profilePicture
          isAdmin
          birthDate
        }
      }
    `;
    return this.apollo
      .watchQuery({
        query: GET_USER_BY_AZUREID,
        variables: {
          azureId: azureId,
        },
      })
      .valueChanges.pipe(map((result: any) => result.data?.userByAzureId));
  }

  getMe(azureId: string): Observable<User> {
    const GET_ME = gql`
      query getMe($azureId: String!) {
        me(azureId: $azureId) {
          azureId
          firstName
          lastName
          profilePicture
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation: GET_ME,
        variables: {
          azureId: azureId,
        },
      })
      .pipe(map((result: any) => result.data.me));
  }
}

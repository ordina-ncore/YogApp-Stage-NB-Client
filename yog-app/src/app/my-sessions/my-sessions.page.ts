import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { LoadingController, NavController } from '@ionic/angular';
import { Apollo, gql } from 'apollo-angular';
import { lastValueFrom, map, Observable, of, switchMap } from 'rxjs';
import { Session, User } from 'src/models';
import { environment } from 'src/assets/environment';

@Component({
  selector: 'app-my-sessions',
  templateUrl: 'my-sessions.page.html',
  styleUrls: ['my-sessions.page.scss'],
})
export class MySessionsPage implements OnInit {
  [x: string]: any;
  sessions$: Observable<Session[] | null | undefined> | null | undefined;
  currentUser: User | undefined;
  isLoading = false;
  showLoader = false;
  userProfilePic: string | undefined = environment.userProfilePicture;

  constructor(
    private apollo: Apollo,
    private router: Router,
    private navController: NavController,
    private loadingCtrl: LoadingController,
    private msalService: MsalService
  ) {}

  ionViewWillEnter() {
    this.fetchSessions();
  }

  async ngOnInit() {
    this.fetchSessions();
  }

  async fetchSessions() {
    this.showLoader = true;
    const currentUser: string | null = localStorage.getItem('currentUser');
    if (currentUser) {
      const loggedInUser: User = JSON.parse(currentUser);
      if(loggedInUser.azureId){
      if(loggedInUser.role === 'User'){
        this.queryUserSessions(loggedInUser.azureId)
      }
      else if (loggedInUser.role === 'Teacher'){
        this.queryTeacherSessions(loggedInUser.azureId);
      }

    }
    }
  }

  onBtnShowSessionsDetailsClicked(sessionId: string) {
    this.router.navigate(['tabs/session-details', sessionId]);
  }
  queryUserSessions(userAzureId: string): void {
    this.sessions$ =  this.apollo
      .watchQuery({
        query: gql`
          query getUpcomingSessions($currentDateTime: DateTime! ) {
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
                  user{
                    azureId
                  }
                }
                teacher {
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
          userAzureId: userAzureId
        },
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(
        map((x: any) => {
          this.showLoader = false;
          // Return only sessions where the current user is a participant
          return x.data?.sessions.nodes.filter((session: any) =>
            session.participants.some(
              (participant: any) => participant.user.azureId === userAzureId
            )
          );
        })
      );
  }

  queryTeacherSessions(teacherAzureId: string): void {
    this.sessions$ =  this.apollo
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
          userAzureId: teacherAzureId
        },
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(
        map((x: any) => {
          this.showLoader = false;
          // Return only sessions where the current user is a teacher
          return x.data?.sessions.nodes.filter((session: any) =>
            session.teacher?.azureId === teacherAzureId
          );
        })
      );
  }
}

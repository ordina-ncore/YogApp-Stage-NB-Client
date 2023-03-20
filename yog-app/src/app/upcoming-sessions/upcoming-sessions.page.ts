import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Session } from 'src/models';

@Component({
  selector: 'app-upcoming-sessions',
  templateUrl: 'upcoming-sessions.page.html',
  styleUrls: ['upcoming-sessions.page.scss'],
})
export class UpcomingSessionsPage implements OnInit {
  [x: string]: any;
  sessions$: Observable<Session[] | null | undefined> | null | undefined;
  isLoading = false;
  showLoader = false;

  constructor(
    private apollo: Apollo,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}
  handleRefresh() {
    this.fetchSessionsWithLoader();
  }

  ngOnInit() {
    this.fetchSessionsWithLoader();
  }

  ionViewWillEnter() {
    this.fetchSessionsWithLoader();
  }

  async fetchSessionsWithLoader() {
    const loading = await this.loadingCtrl.create({
      message: 'Fetching sessions...',
    });
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
                startDateTime
                endDateTime
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
        },
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(
        map((x: any) => {
          this.isLoading = !x.loading;
          console.log(this.isLoading);
          return x.data?.sessions.nodes;
        })
      );
  }
}

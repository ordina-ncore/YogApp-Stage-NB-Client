import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Session } from 'src/models';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss'],
})
export class SessionDetailsComponent implements OnInit {
  session$: Observable<Session| null | undefined> | null | undefined;

  constructor(private route: ActivatedRoute, private apollo: Apollo, private loadingCtrl: LoadingController) {

    if(this.route.snapshot.params['id']){
      let receivedId: string = this.route.snapshot.params['id'];
      this.fetchSessionDetails(receivedId);
    }
  }

  ngOnInit() {}

  async fetchSessionDetails(receivedId: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Fetching session details..'
    });

    await loading.present();
    this.session$ = this.getSessionDetails(receivedId);
    const subscription = this.session$.subscribe({
      next: () => {
        loading.dismiss();
        subscription.unsubscribe();
      },
      error: () => {
        loading.dismiss();
        subscription.unsubscribe();
      }
    });
  }

  getSessionDetails(sessionId: string): Observable<Session| null | undefined>{
    const GET_SESSION_BY_ID = gql`
      query GetSessionById($id: UUID!) {
        session(id: $id) {
          id
          title
          startDateTime
          endDateTime
          capacity
          teacher {
            id
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
              id
              firstName
              lastName
              profilePicture
            }
          }
        }
      }
    `;
    return this.apollo
      .watchQuery({
        query:GET_SESSION_BY_ID,
        variables: {
          id: sessionId,
        }
      })
      .valueChanges.pipe(map((x: any) => x.data?.session));
  }

}

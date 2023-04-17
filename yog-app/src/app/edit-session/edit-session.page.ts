import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import {
  CreateSessionInput,
  EditSessionInput,
  Room,
  Session,
  User,
} from 'src/models';
import { ToasterService } from '../shared/services/toaster.service';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.page.html',
  styleUrls: ['./edit-session.page.scss'],
})
export class EditSessionPage implements OnInit {
  session$: Session | null | undefined;
  rooms$: Room[] | null | undefined;
  teachers$: User[] | null | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private loadingCtrl: LoadingController,
    private toasterService: ToasterService,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    if (this.route.snapshot.params['id']) {
      const loading = await this.loadingCtrl.create({
        message: this.translate.instant('fetching_session_details'),
      });
      await loading.present();
      let receivedId: string = this.route.snapshot.params['id'];
      this.getSessionDetails(receivedId).subscribe((session) => {
        if (session) this.session$ = session;
        this.queryRooms().subscribe((rooms) => {
          if (rooms) this.rooms$ = rooms;
          this.queryTeachers().subscribe((teachers) => {
            if (teachers) {
              if (teachers) this.teachers$ = teachers; // convert to observable
              loading.dismiss();
            }
          });
        });
      });
    }
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
  async receiveEditedRoom(editedSessionInput: EditSessionInput) {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('updating_session'),
    });
    await loading.present();
    this.mutationEditSession(editedSessionInput).subscribe(
      (result) => {
        loading.dismiss();
        this.router.navigate(['tabs/session-details', result.id]);
      },
      (error) => {
        loading.dismiss();
        this.toasterService.presentToast('top', error.message, 1500);
      }
    );
  }

  mutationEditSession(sessionInput: EditSessionInput): Observable<Session> {
    const mutation = gql`
      mutation EditSession($input: EditSessionInput!) {
        editSession(input: $input) {
          id
        }
      }
    `;
    return this.apollo
      .mutate<{ editSession: Session }>({
        mutation,
        variables: {
          input: sessionInput,
        },
      })
      .pipe(map((result: any) => result.data.editSession));
  }

  getSessionDetails(sessionId: string): Observable<Session | null | undefined> {
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
    return this.apollo
      .watchQuery({
        query: GET_SESSION_BY_ID,
        variables: {
          id: sessionId,
        },
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(
        map((x: any) => {
          return x.data?.session;
        })
      );
  }
}

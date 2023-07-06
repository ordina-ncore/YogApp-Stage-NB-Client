import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import {
  CreateSessionParticipantInput,
  Session,
  SessionParticipant,
  User,
} from 'src/models';

@Component({
  selector: 'app-session-details-view',
  templateUrl: './session-details-view.component.html',
  styleUrls: ['./session-details-view.component.scss'],
})
export class SessionDetailsViewComponent implements OnChanges, OnInit {
  @Input() receivedSession: Session | undefined | null;
  @Input() isLoading = false;
  @Output() btnEditClicked = new EventEmitter<string>();
  @Output() btnCancelClicked = new EventEmitter();
  currentUser: User | undefined;
  selectedMatNumber: number | null | undefined = null;
  currentUserMatNumber: number | null = null;

  constructor(
    private router: Router,
    private apollo: Apollo,
    private loadingCtrl: LoadingController,
    public alertController: AlertController,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    const ON_SESSION_DETAILS_CHANGED_SUBSCRIPTION = gql`
    subscription OnSessionDetailsChangedSubscription {
      onSessionDetailsChanged {
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
    this.apollo.subscribe({
      query: ON_SESSION_DETAILS_CHANGED_SUBSCRIPTION,

    }).subscribe((result: any) => {
      if (result.data) {
        this.currentUserMatNumber = null;
        this.receivedSession = result.data.onSessionDetailsChanged;
        console.log( this.receivedSession)

      }
    });

  }

  ngOnChanges() {
    const user: string | null = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
      //this.GetCurrentUserMatNumber();
    }
  }
  showRoomDetails(roomId: string | undefined){
    if(roomId){
      this.router.navigate(['tabs/room-details', roomId]);
    }
  }

  onBackBtnClicked() {
    this.router.navigate(['tabs/upcoming-sessions']);
  }
  onBtnEditClicked() {
    this.btnEditClicked.emit(this.receivedSession?.id);
  }
  onBtnCancelClicked() {
    this.btnCancelClicked.emit();
  }
  getCapacityRange() {
    if (this.receivedSession?.capacity) {
      return Array.from({ length: this.receivedSession.capacity }, (_, i) => i);
    }
    return [];
  }
  isMatNumberTaken(matNumber: number): boolean {
    if (this.receivedSession?.participants) {
      return this.receivedSession.participants.some(
        (participant) => participant.matNumber === matNumber
      );
    }
    return true;
  }

  async signUp() {
    const currentUser: string | null = localStorage.getItem('currentUser');
    if (currentUser) {
      const loggedInUser: User = JSON.parse(currentUser);
      const loading = await this.loadingCtrl.create({
        message: this.translate.instant('signing_up'),
      });
      loading.present();
      if (this.selectedMatNumber != null) {
        var input: CreateSessionParticipantInput = {
          userAzureId: loggedInUser.azureId,
          matNumber: this.selectedMatNumber,
          sessionId: this.receivedSession?.id,
        };
        this.mutateSessionParticipant(input).subscribe(
          (createSessionParticipant) => {
            console.log(createSessionParticipant);
            if (
              createSessionParticipant?.matNumber === this.selectedMatNumber
            ) {
              loading.dismiss();
            }
          }
        );
      }
    }
  }

  GetCurrentUserMatNumber() {
    if (this.currentUserMatNumber !== null) {
      return this.currentUserMatNumber;
    } else {
      if (this.receivedSession?.participants) {
        const currentUser: string | null = localStorage.getItem('currentUser');
        if (currentUser) {
          const loggedInUser: User = JSON.parse(currentUser);
          let foundMatNumber: number | null = null;
          this.receivedSession?.participants.forEach((participant) => {
            if (participant.user?.azureId === loggedInUser.azureId) {
              this.currentUserMatNumber = participant.matNumber;
              foundMatNumber = this.currentUserMatNumber;
              console.log(foundMatNumber);
            }
          });
          return foundMatNumber;
        }
      }
      return null;
    }
  }
  async onBtnUserCancelClicked() {
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('cancelling_registration'),
    });
    const alert = await this.alertController.create({
      header: this.translate.instant('confirmation'),
      message: this.translate.instant('sure_unregister'),
      buttons: [
        {
          text: this.translate.instant('no'),
          role: 'cancel',
          handler: () => {},
        },
        {
          text: this.translate.instant('yes'),
          handler: () => {

            if (this.receivedSession) {
              loading.present();
              const sessionId = this.receivedSession.id;
              const currentUserMatNumber = this.currentUserMatNumber;
              if (sessionId && currentUserMatNumber !== null) {
                this.cancelSessionParticipant(
                  sessionId,
                  currentUserMatNumber
                ).subscribe((SessionParticipant) => {
                  console.log(SessionParticipant);
                  this.selectedMatNumber = null;
                  this.currentUserMatNumber = null;
                  loading.dismiss();
                });
              }
            }
          },
        },
      ],
    });
    alert.present();
  }

  onBtnShowParticipantInfoClicked(matNumber: number){
    if (this.receivedSession?.participants) {
    this.receivedSession?.participants.forEach((participant) => {
      if (participant.matNumber === matNumber) {
        this.showParticipantInfo(participant)
      }
    });
  }
  }

  async showParticipantInfo(participant: SessionParticipant){
    console.log(participant)
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('removing_user'),
    });
    const alert = await this.alertController.create({
      header: `${participant.user?.firstName} ${participant.user?.lastName}`,
      message: ` <div>
      <p><ion-icon name="time-outline"></ion-icon> ${participant.timeStampSignUp}</p>
      <p><ion-icon name="clipboard-outline"></ion-icon>${this.translate.instant('number')}. ${participant.matNumber + 1}</p>
        <img class="popUpImg" src="${participant.user?.profilePicture}" />
        </div>
    `,
      buttons: [
        {
          text: this.translate.instant('close'),
          role: 'cancel',
          handler: () => {},
        },
        {
          text: this.translate.instant('remove'),
          handler: () => {
            if (this.receivedSession) {
              loading.present();
              const sessionId = this.receivedSession.id;
              if (sessionId && participant.matNumber !== null) {
                this.cancelSessionParticipant(
                  sessionId,
                  participant.matNumber
                ).subscribe((SessionParticipant) => {
                  console.log(SessionParticipant);
                  this.selectedMatNumber = null;
                  this.currentUserMatNumber = null;
                  loading.dismiss();
                });
              }
            }
          },
        },
      ],
    });
    alert.present();
  }

  mutateSessionParticipant(
    input: CreateSessionParticipantInput
  ): Observable<SessionParticipant | null | undefined> {
    const mutation = gql`
      mutation CreateSessionParticipant(
        $input: CreateSessionParticipantInput!
      ) {
        createSessionParticipant(input: $input) {
          matNumber
        }
      }
    `;
    return this.apollo
      .mutate<{ createSessionParticipant: SessionParticipant }>({
        mutation,
        variables: {
          input: input,
        },
      })
      .pipe(
        map((result: any) => {
          return result.data.createSessionParticipant;
        })
      );
  }

  cancelSessionParticipant(
    sessionId: string,
    matNumber: number
  ): Observable<SessionParticipant | null | undefined> {
    const mutation = gql`
      mutation removeSessionParticipant(
        $matNumber: Int!
        $sessionId: UUID!
      ) {
        removeSessionParticipant(matNumber: $matNumber, sessionId: $sessionId) {
          id
          matNumber
        }
      }
    `;
    return this.apollo
      .mutate<{ removedSessionParticipant: SessionParticipant }>({
        mutation,
        variables: {
          matNumber: matNumber,
          sessionId: sessionId,
        },
      })
      .pipe(
        map((result: any) => {
          return result.data.removedSessionParticipant;
        })
      );
  }
}

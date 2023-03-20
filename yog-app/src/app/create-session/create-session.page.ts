import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import { CreateSessionInput, Room, Session } from 'src/models';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToasterService} from '../shared/services/toaster.service';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.page.html',
  styleUrls: ['./create-session.page.scss'],
})
export class CreateSessionPage implements OnInit {

  rooms$: Observable<Room[]| null | undefined> | null | undefined;
  constructor(private apollo: Apollo, private loadingCtrl: LoadingController, private router: Router, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.queryUpcomingSessions();
  }

  //METHODS
  async receiveCreatedRoom(createdSessionInput: CreateSessionInput){
    console.log("aangekomen: " + createdSessionInput.title)

    // Show loading animation
    const loading = await this.loadingCtrl.create({
      message: 'Creating session...'
    });
    await loading.present();

    this.mutationCreateSession(createdSessionInput).subscribe(
      result => {
        this.router.navigate(['tabs/upcoming-sessions']);
        loading.dismiss();

      },
      error => {
        loading.dismiss();
        this.toasterService.presentToast('top', error.message, 1500)
        }
    );
  }

  queryUpcomingSessions(){
    this.rooms$ = this.apollo
      .watchQuery({
        query: gql`
          {
            rooms{
              nodes{
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


  mutationCreateSession(sessionInput: CreateSessionInput): Observable<Session>{
    console.log("in mutationCreateSession method")
    const mutation = gql`
      mutation CreateSession($input: CreateSessionInput!) {
        createSession(input: $input) {
          id
          }
        }
      `;
    return this.apollo.mutate<{createSession: Session}>({
      mutation,
      variables: { input: sessionInput }
    }).pipe(map((result: any) => result.data.createSession));
  }

}



import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Session } from 'src/models';

@Component({
  selector: 'app-session-details-view',
  templateUrl: './session-details-view.component.html',
  styleUrls: ['./session-details-view.component.scss'],
})
export class SessionDetailsViewComponent implements OnChanges {
  @Input() receivedSession: Session | undefined | null;

  constructor() { }

  ngOnChanges() {

    console.log(this.receivedSession)
  }

}

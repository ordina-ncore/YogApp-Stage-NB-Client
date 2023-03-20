import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { type } from 'os';
import { Session } from 'src/models';

@Component({
  selector: 'app-upcoming-sessions-view',
  templateUrl: './upcoming-sessions-view.component.html',
  styleUrls: ['./upcoming-sessions-view.component.scss'],
})
export class UpcomingSessionsViewComponent implements OnChanges {

  @Input() receivedSessions: Session[] | undefined | null;
  @Input() isLoading = false;
  @Output() btnShowSessionsDetailsClicked = new EventEmitter<[string]>();
  constructor() { }

  ngOnChanges() {
    console.log(this.receivedSessions)
  }

  getDayString(startDateTime: Date| undefined): string {
    if (!startDateTime) {
      return '';
    }
    let startDate: Date = new Date(startDateTime);
    const today: Date = new Date();
    const tomorrow: Date = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startDay: number = startDate.getDate();
    const startMonth: number = startDate.getMonth() + 1;
    const startYear: number  = startDate.getFullYear();

    if (startDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (startDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return `${startDay.toString().padStart(2, '0')}/${startMonth.toString().padStart(2, '0')}/${startYear.toString()}`;
    }
  }

  onBtnShowSessionsDetailsClicked(selectedSessionId?: string) {
   if(selectedSessionId) this.btnShowSessionsDetailsClicked.emit([selectedSessionId])
  }

}

import {
  Component,
  Input,
  Output,
  OnChanges,
  EventEmitter,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { type } from 'os';
import { Session, User } from 'src/models';

@Component({
  selector: 'app-upcoming-sessions-view',
  templateUrl: './upcoming-sessions-view.component.html',
  styleUrls: ['./upcoming-sessions-view.component.scss'],
})
export class UpcomingSessionsViewComponent implements OnChanges {
  @Input() receivedSessions: Session[] | undefined | null;
  @Input() isLoading = false;
  @Output() btnShowSessionsDetailsClicked = new EventEmitter<[string]>();
  constructor(public translate: TranslateService) {}

  ngOnChanges() {}

  getDayString(startDateTime: Date | undefined): string {
    if (!startDateTime) {
      return '';
    }
    let startDate: Date = new Date(startDateTime);
    const today: Date = new Date();
    const tomorrow: Date = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startDay: number = startDate.getDate();
    const startMonth: number = startDate.getMonth() + 1;
    const startYear: number = startDate.getFullYear();

    if (startDate.toDateString() === today.toDateString()) {
      return this.translate.instant('today');
    } else if (startDate.toDateString() === tomorrow.toDateString()) {
      return this.translate.instant('tomorrow');
    } else {
      return `${startDay.toString().padStart(2, '0')}/${startMonth
        .toString()
        .padStart(2, '0')}/${startYear.toString()}`;
    }
  }

  getCapacityString(session: Session): string {
    if (session.capacity !== undefined && session.participants !== undefined) {
      if (session.capacity <= session.participants.length) {
        return this.translate.instant('full');
      } else {
        return session.participants.length + ' / ' + session.capacity;
      }
    } else {
      return '';
    }
  }

  isCurrentUserSignedUpForThisSession(session:Session):boolean{
    const user: User | null = JSON.parse(
      localStorage.getItem('currentUser') || 'null'
    );
    if(session && session.participants !== undefined && session.participants.some(
      (participant: any) => participant.user.azureId === user?.azureId
    )){
      return true;
    }
    return false;
  }

  getCapacityStringColor(session: Session): string {
    if (session.capacity !== undefined && session.participants !== undefined) {
      if (session.capacity <= session.participants.length) {
        return 'red';
      } else if (session.capacity - session.participants.length <= 3) {
        return 'orange';
      } else if (session.capacity - session.participants.length <= 5) {
        return 'yellow';
      } else {
        return 'green';
      }
    } else {
      return '';
    }
  }
  getTeacherNameString(session: Session): string {
    if (session.teacher !== undefined) {
    const currentUser: string | null = localStorage.getItem('currentUser');
    if (currentUser) {
      const loggedInUser: User = JSON.parse(currentUser);
        if(session.teacher.azureId === loggedInUser.azureId) return this.translate.instant('you')
        else return session.teacher.firstName + ' '  + session.teacher.lastName;
      }
    }
    return this.translate.instant('unknown');
    }
  onBtnShowSessionsDetailsClicked(selectedSessionId?: string) {
    if (selectedSessionId)
      this.btnShowSessionsDetailsClicked.emit([selectedSessionId]);
  }
}

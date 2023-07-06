import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Room, User } from 'src/models';

@Component({
  selector: 'app-room-details-view',
  templateUrl: './room-details-view.component.html',
  styleUrls: ['./room-details-view.component.scss'],
})
export class RoomDetailsViewComponent implements OnInit {
  @Input() receivedRoom: Room | undefined | null;
  @Output() btnRemoveClicked = new EventEmitter();
  currentUser: User | undefined;

  constructor(private router: Router) { }

  ngOnInit() {
    const user: string | null = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }
  onBackBtnClicked(){
    if(this.currentUser?.role === 'Teacher'){
      this.router.navigate(['tabs/rooms']);
    }
    else{
      this.router.navigate(['tabs/upcoming-sessions']);
    }
  }

  onBtnEditClicked(roomId: string | undefined){
    this.router.navigate(['tabs/edit-room', roomId]);
  }

  onBtnCancelClicked(){
    this.btnRemoveClicked.emit();
  }

}

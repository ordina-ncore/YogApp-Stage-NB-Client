import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from 'src/models';

@Component({
  selector: 'app-rooms-view',
  templateUrl: './rooms-view.component.html',
  styleUrls: ['./rooms-view.component.scss'],
})
export class RoomsViewComponent implements OnInit {
  @Input() receivedRooms: Room[] | undefined | null;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this.receivedRooms)
  }

  onBackBtnClicked() {
    this.router.navigate(['tabs/upcoming-sessions']);
  }
  onBtnCreateNewRoomClicked(){
    this.router.navigate(['tabs/create-room']);
  }
  onBtnEditRoomsClicked(roomId: string | undefined){
    this.router.navigate(['tabs/room-details', roomId]);
  }

}

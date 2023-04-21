import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateRoomInput, Room } from 'src/models';

@Component({
  selector: 'app-create-room-view',
  templateUrl: './create-room-view.component.html',
  styleUrls: ['./create-room-view.component.scss'],
})
export class CreateRoomViewComponent implements OnInit {
  form: FormGroup;
  @Output() createRoom = new EventEmitter<CreateRoomInput>();

  constructor(private formBuilder: FormBuilder, private router: Router) {

    this.form = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      address: new FormControl('', Validators.required),
      capacity: new FormControl('', Validators.required),
      description: new FormControl('')
    });
  }

  ngOnInit() {}
  onBackBtnClicked(){
    this.router.navigate(['tabs/rooms']);
  }

  onSubmit() {
    if (this.form.valid) {
      let createRoom: CreateRoomInput = {
        name: this.form.value.name,
        address: this.form.value.address,
        capacity: this.form.value.capacity,
        description: this.form.value.description
      };
      this.createRoom.emit(createRoom);
  }
}

}

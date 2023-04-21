import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateRoomInput, EditRoomInput, Room } from 'src/models';

@Component({
  selector: 'app-edit-room-view',
  templateUrl: './edit-room-view.component.html',
  styleUrls: ['./edit-room-view.component.scss'],
})
export class EditRoomViewComponent implements OnInit, OnChanges {
  form: FormGroup;
  @Input() receivedRoom: Room | undefined | null;
  @Output() editedRoom = new EventEmitter<EditRoomInput>();

  constructor(private formBuilder: FormBuilder, private router: Router) {
    console.log(this.receivedRoom)
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

  ngOnInit() {

  }
  ngOnChanges() {
    this.form = this.formBuilder.group({
      name: new FormControl(this.receivedRoom?.name, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      address: new FormControl(this.receivedRoom?.address, Validators.required),
      capacity: new FormControl(this.receivedRoom?.capacity, Validators.required),
      description: new FormControl(this.receivedRoom?.description)
    });
  }
  onBackBtnClicked(){
    this.router.navigate(['tabs/room-details', this.receivedRoom?.id]);
  }

  onSubmit() {
    if (this.form.valid) {
      let editedRoom: EditRoomInput = {
        id: this.receivedRoom?.id,
        name: this.form.value.name,
        address: this.form.value.address,
        capacity: this.form.value.capacity,
        description: this.form.value.description
      };
      this.editedRoom.emit(editedRoom);
  }
}

}

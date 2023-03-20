import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { CreateSessionInput, Room, Session } from 'src/models';

@Component({
  selector: 'app-create-session-view',
  templateUrl: './create-session-view.component.html',
  styleUrls: ['./create-session-view.component.scss'],
})
export class CreateSessionViewComponent {
  @Input() receivedRooms: Room[] | undefined | null;
  @Output() createdSession = new EventEmitter<Object>();
  form: FormGroup;
  date!: Date;
  startDateTime!: Date;
  endDateTime!: Date;
  currentDay: string = new Date().toISOString();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      room: new FormControl('', Validators.required),
      capacity: new FormControl('', Validators.required),
      startDateTime: new FormControl('', Validators.required),
      endDateTime: new FormControl('', Validators.required),
    });
  }
  getStartDateDay(): string {
    let startDateTime: Date = new Date(this.form.value.startDateTime);
    let maxEndDateTime: Date = new Date(
      startDateTime.getFullYear(),
      startDateTime.getMonth(),
      startDateTime.getDate(),
      23,
      45
    );
    return maxEndDateTime.toISOString();
  }
  onSubmit() {
    if (this.form.valid) {
      let createSessionInput: CreateSessionInput = {
        title: this.form.value.title,
        roomId: this.form.value.room.id,
        capacity: this.form.value.capacity,
        startDateTime: this.form.value.startDateTime,
        endDateTime: this.form.value.endDateTime,
        teacherId: '6cd47e7d-bd19-4238-9974-65b825ee5539',
      };
      console.log(createSessionInput);
      this.createdSession.emit([createSessionInput]);
    }
  }
}

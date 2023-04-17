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
import { Router } from '@angular/router';
import { CreateSessionInput, Room, Session, User } from 'src/models';

@Component({
  selector: 'app-create-session-view',
  templateUrl: './create-session-view.component.html',
  styleUrls: ['./create-session-view.component.scss'],
})
export class CreateSessionViewComponent {
  form: FormGroup;
  date!: Date;
  startDateTime!: Date;
  endDateTime!: Date;
  currentDay: string = new Date().toISOString();
  loggedInUser: User | undefined | null;
  @Input() receivedRooms: Room[] | undefined | null;
  @Input() receivedTeachers: User[] | undefined | null;
  @Output() createSession = new EventEmitter<[Object]>();

  constructor(private formBuilder: FormBuilder, private router: Router) {
    const currentUser: string | null = localStorage.getItem('currentUser');
    if (currentUser) {
     this.loggedInUser = JSON.parse(currentUser);
    }

    this.form = this.formBuilder.group({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      room: new FormControl('', Validators.required),
      teacher: new FormControl('', Validators.required),
      capacity: new FormControl('', [Validators.required, this.capacityValidator()]),
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
          teacherId: this.form.value.teacher.azureId,
        };
        console.log(createSessionInput);
        this.createSession.emit([createSessionInput]);
    }
  }
  capacityValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const formGroup = control.parent as FormGroup;
      if (!formGroup) {
        return null;
      }
      const capacity = control.value;
      const room = formGroup.controls['room'].value;
      if (capacity && room.capacity && capacity > room.capacity) {
        return { 'capacityExceeded': true };
      }
      return null;
    };
  }


  onBackBtnClicked() {
    this.router.navigate(['tabs/upcoming-sessions']);
  }
}

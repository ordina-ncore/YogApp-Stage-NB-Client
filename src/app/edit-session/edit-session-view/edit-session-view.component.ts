import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  CreateSessionInput,
  EditSessionInput,
  Room,
  Session,
  User,
} from 'src/models';

interface SessionFormModel {
  title: string;
  teacher: '';
  capacity: number;
  room: Room;
  startDateTime: Date;
  endDateTime: Date;
}


@Component({
  selector: 'app-edit-session-view',
  templateUrl: './edit-session-view.component.html',
  styleUrls: ['./edit-session-view.component.scss'],
})
export class EditSessionViewComponent implements OnChanges {
  @Input() receivedRooms: Room[] | undefined | null;
  @Input() receivedSession: Session | undefined | null;
  @Input() receivedTeachers: User[] | undefined | null;
  @Output() editedSession = new EventEmitter<CreateSessionInput>();
  date: Date | null | undefined;
  startDateTime: Date | null | undefined;
  endDateTime: Date | null | undefined;
  currentDay: string = new Date().toISOString();
  editForm: FormGroup;
  sessionFormModel: SessionFormModel = {
    title: '',
    teacher: '',
    capacity: 0,
    room: {} as Room,
    startDateTime: new Date(),
    endDateTime: new Date(),
  };

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.editForm = this.createForm(this.sessionFormModel);
  }

  private createForm(model: SessionFormModel): FormGroup {
    return this.formBuilder.group({
      title: [model.title, [Validators.required, Validators.maxLength(20)]],
      teacher: [model.teacher, Validators.required],
      capacity: [model.capacity, Validators.required],
      room: [model.room, Validators.required],
      startDateTime: [model.startDateTime, Validators.required],
      endDateTime: [model.endDateTime, Validators.required],
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges?.['receivedSession']?.currentValue) {
      this.editForm = this.formBuilder.group({
        title: new FormControl(this.receivedSession?.title, [
          Validators.required,
          Validators.maxLength(25),
        ]),
        room: new FormControl(
          this.receivedSession?.room?.id,
          Validators.required
        ),
        capacity: new FormControl(
          this.receivedSession?.capacity,
          [Validators.required, this.capacityValidator()]
        ),
        teacher: new FormControl(
          this.receivedSession?.teacher?.azureId,
          Validators.required
        ),
        startDateTime: new FormControl(
          this.receivedSession?.startDateTime,
          Validators.required
        ),
        endDateTime: new FormControl(
          this.receivedSession?.endDateTime,
          Validators.required
        ),
      });
    }
  }
  onSubmit() {
    const currentUser: string | null = localStorage.getItem('currentUser');
    if (currentUser) {
      console.log(this.editForm.value)
      const loggedInUser: User = JSON.parse(currentUser);
      if (this.editForm.valid) {
        let sessionFormModel: SessionFormModel = this.editForm.value;
        let editedSessionInput: EditSessionInput = {
          id: this.receivedSession?.id,
          title: sessionFormModel.title,
          roomId: sessionFormModel.room,
          capacity: sessionFormModel.capacity,
          teacherId: sessionFormModel.teacher,
          startDateTime: sessionFormModel.startDateTime,
          endDateTime: sessionFormModel.endDateTime,
        };
        this.editedSession.emit(editedSessionInput);
      }
    }
  }
  onBackBtnClicked() {
    this.router.navigate(['tabs/session-details', this.receivedSession?.id]);
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

  getStartDateDay(): string {
    let startDateTime: Date = new Date(this.editForm.value.startDateTime);
    let maxEndDateTime: Date = new Date(
      startDateTime.getFullYear(),
      startDateTime.getMonth(),
      startDateTime.getDate(),
      23,
      45
    );
    return maxEndDateTime.toISOString();
  }
}

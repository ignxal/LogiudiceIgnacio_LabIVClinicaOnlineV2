import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UserM } from '../../../models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-appointment-specialist',
  templateUrl: './request-appointment-specialist.component.html',
  styleUrls: ['./request-appointment-specialist.component.scss'],
})
export class RequestAppointmentDoctorComponent implements OnInit {
  specialists: any;
  @Input() specialty: any;
  @Output() selectedDoctorEvent = new EventEmitter<string>();

  constructor(
    private loaderService: LoaderService,
    public auth: AuthService,
    public userService: UserService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.loaderService.show();
    this.userService.getAllApprovedSpecialists().subscribe({
      next: (x: UserM[]) => {
        this.specialists = x.filter(
          (specialist) => specialist.specialty === this.specialty
        );

        this.loaderService.hide();
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Se produjo un error al intentar obtener la lista de pacientes',
        });
        this.loaderService.hide();
      },
    });
  }

  selectDoctor(e: any) {
    this.selectedDoctorEvent.emit(e.target.value);
  }
}

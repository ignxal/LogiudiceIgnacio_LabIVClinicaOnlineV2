import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-appointment-specialty',
  templateUrl: './request-appointment-specialty.component.html',
  styleUrls: ['./request-appointment-specialty.component.css'],
})
export class RequestAppointmentSpecialtyComponent implements OnInit {
  specialtiesList: any;
  @Output() selectedSpecialtyEvent = new EventEmitter<string>();

  constructor(
    private loaderService: LoaderService,
    public auth: AuthService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.initSpecialties();
  }

  initSpecialties() {
    this.loaderService.show();

    this.userService.getAllApprovedSpecialists().subscribe({
      next: (users: any) => {
        this.specialtiesList = users
          .map((user: any) => user.specialty)
          .filter(
            (specialty: any, index: any, self: any) =>
              self.indexOf(specialty) === index
          );

        this.loaderService.hide();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Se produjo un error al intentar obtener la lista de usuarios',
        });
        this.loaderService.hide();
      },
    });
  }

  selectSpecialty(e: any) {
    this.selectedSpecialtyEvent.emit(e.target.value);
  }
}

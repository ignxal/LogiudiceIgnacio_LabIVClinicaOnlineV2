import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Roles } from '../../models/roles';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  selectedUser: any;
  users: {
    role: Roles;
    email: string;
    fullName: string;
    password: string;
  }[] = [
    {
      role: 'Patient',
      email: 'lelelapancha@patient.com',
      fullName: 'Lele Lapancha',
      password: '123456',
    },
    {
      role: 'Patient',
      email: 'lelelapata@patient.com',
      fullName: 'Lele Lapata',
      password: '123456',
    },
    {
      role: 'Patient',
      email: 'lelelapie@patient.com',
      fullName: 'Lele Lapie',
      password: '123456',
    },
    {
      role: 'Specialist',
      email: 'juanitoperez@waterisgone.com',
      fullName: 'Juan Perez',
      password: '123456',
    },
    {
      role: 'Specialist',
      email: 'deslelelapancha@specialist.com',
      fullName: 'Deslele Lapancha',
      password: 'qwerty',
    },
    {
      role: 'Admin',
      email: 'admin@tippabble.com',
      fullName: 'Administrador Tippable',
      password: '123456!',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private loader: LoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submitForm() {
    this.loader.show();
    this.auth
      .loginUser(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      )
      .then((result) => {
        this.loader.hide();
        if (result.result) {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesion exitoso!',
            text: 'Redirigiendo al inicio...',
            timer: 1500,
            didDestroy: () => {
              this.resetForm();
              this.router.navigate(['']);
            },
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error en el inicio de sesion!',
            text: result.error,
          });
          this.resetForm();
        }
      });
  }

  resetForm() {
    this.loginForm.get('email')?.setValue('');
    this.loginForm.get('password')?.setValue('');
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.loginForm.patchValue({
      email: user.email,
      password: user.password,
    });
  }

  getImage(role: Roles) {
    switch (role) {
      case 'Admin':
        return 'assets/register/admin.png';
      case 'Specialist':
        return 'https://firebasestorage.googleapis.com/v0/b/clinica-online-v2.appspot.com/o/profile-pictures%2Fdeslelelapancha%40specialist.com%2F1701313958146?alt=media&token=af750b37-7032-4b6f-a2a5-8fb01930b152';
      case 'Patient':
        return 'https://firebasestorage.googleapis.com/v0/b/clinica-online-v2.appspot.com/o/profile-pictures%2Flelelapancha%40patient.com%2F1701313819991?alt=media&token=094e702e-7487-4566-bcfb-0aebcea0e61e';
    }
  }
}

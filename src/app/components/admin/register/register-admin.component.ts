import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserM } from '../../../models/user';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Timestamp } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.scss'],
})
export class RegisterAdminComponent implements OnInit {
  registroForm!: FormGroup;
  title: string = 'Formulario de registro';
  captcha: boolean = false;
  file: any = [];

  constructor(
    private auth: AuthService,
    private loader: LoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registroForm = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+$'),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+$'),
        ]),
        age: new FormControl('', [
          Validators.required,
          Validators.min(0),
          Validators.max(200),
        ]),
        dni: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(9),
        ]),
        obraSocial: new FormControl(''),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        password2: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        perfil: new FormControl('', [
          Validators.required,
          Validators.nullValidator,
        ]),
        perfil2: new FormControl(''),
      },
      this.checkPasswords()
    );
  }

  get perfil2() {
    return this.registroForm.get('perfil2');
  }
  get perfil() {
    return this.registroForm.get('perfil');
  }

  get password() {
    return this.registroForm.get('password');
  }
  get password2() {
    return this.registroForm.get('password2');
  }
  get email() {
    return this.registroForm.get('email');
  }
  get name() {
    return this.registroForm.get('name');
  }
  get lastName() {
    return this.registroForm.get('lastName');
  }
  get age() {
    return this.registroForm.get('age');
  }
  get dni() {
    return this.registroForm.get('dni');
  }

  submitForm() {
    this.registroForm.markAllAsTouched();

    if (!this.captcha) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro!',
        text: 'Reintenta el ingreso del captcha',
      });
      return;
    }

    if (this.registroForm.valid) {
      this.loader.show();
      const pw = this.password?.value;
      const u = this.getUser();

      this.auth
        .registerUser(u, pw, this.file)
        .then((result) => {
          this.registerSuccess(result);
          this.loader.hide();
        })
        .catch((err) => {
          this.loader.hide();
          console.log(err);
        });
    }
  }

  getUser(): UserM {
    return {
      uid: '',
      id_user: '',
      email: this.email?.value,
      name: this.name?.value,
      lastName: this.lastName?.value,
      dni: this.dni?.value,
      age: this.age?.value,
      serviceHours: null,
      photoURL: '',
      imageUrl: [],
      role: 'Admin',
      healthInsurance: '',
      specialty: '',
      emailVerified: false,
      approved: true,
      registerDate: Timestamp.now(),
      confirmationDate: null,
    };
  }

  registerSuccess(result: { result: boolean; error: string }) {
    if (result.result) {
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso!',
        text: 'Redirigiendo al inicio...',
        timer: 1500,
      }).then((r) => {
        this.auth.sendMailConfirmation();
        this.resetForm();
        this.router.navigate(['']);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro!',
        text: result.error,
      });
    }
  }

  handleFileInput($event: any, input: string) {
    const files = Array.from($event.target.files);
    this.file.push(...files);
    this.registroForm.get(input)?.setValue(files);
  }

  resetForm() {
    this.registroForm.reset();
    this.perfil?.setValue('');
    this.perfil2?.setValue('');
    this.name?.setValue('');
    this.lastName?.setValue('');
    this.age?.setValue('');
    this.dni?.setValue('');
    this.email?.setValue('');
    this.password?.setValue('');
  }

  captchaResult(result: any) {
    this.captcha = result;
  }

  private checkPasswords(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password');
      const passwordConfirmation = formGroup.get('password2');

      if (password?.value !== passwordConfirmation?.value) {
        formGroup
          .get('password2')
          ?.setErrors({ errorMatch: 'La contraseña no coincide' });
        return { errorMatch: 'La contraseña no coincide' };
      } else {
        formGroup.get('password2')?.valid;
        return null;
      }
    };
  }
}

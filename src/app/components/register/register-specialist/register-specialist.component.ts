import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserM } from '../../../models/user';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SpecialtyService } from 'src/app/services/specialty.service';
import { LoaderService } from 'src/app/services/loader.service';
import Swal from 'sweetalert2';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register-specialist.component.html',
  styleUrls: ['./register-specialist.component.scss'],
})
export class RegisterSpecialistComponent implements OnInit {
  registroForm!: FormGroup;
  title: string = 'Formulario de registro';
  specialties: string[] = [];
  specialtiesSub!: Subscription;
  captcha: boolean = false;
  file: any = [];

  constructor(
    private auth: AuthService,
    private loader: LoaderService,
    private router: Router,
    private speService: SpecialtyService
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
        specialty: new FormControl(''),
        email: new FormControl('', [Validators.required, Validators.email]),
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
      },
      this.checkPasswords()
    );

    this.specialtiesSub = this.speService.getAll().subscribe((s) => {
      this.specialties = s.map((x) => x.name);
    });
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
  get specialty() {
    return this.registroForm.get('specialty');
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
      let contraseña = this.password?.value;
      let usuario = this.getUser();
      this.auth
        .registerUser(usuario, contraseña, this.file)
        .then((result) => {
          this.registerSuccess(result);
          this.loader.hide();
        })
        .catch((e) => {
          this.loader.hide();
          console.log(e);
        });
      return;
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
      role: 'Specialist',
      healthInsurance: '',
      specialty: this.specialty?.value,
      emailVerified: false,
      approved: false,
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

  async addEspecialidad() {
    let specialty: string = '';
    const inputValue = specialty;
    const { value: input } = await Swal.fire({
      title: 'Nueva especialidad',
      input: 'text',
      inputLabel: 'Ingrese una nueva especialidad:',
      inputValue,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Cargar',
      inputValidator: (value) => {
        if (!value) return 'Escribe algo!';

        if (this.specialties.indexOf(value) !== -1)
          return 'La especialidad ya existe!';

        return '';
      },
    });
    if (input) {
      this.speService.addOne(input).then(() => {
        Swal.fire(`Nueva especialidad agregada: ${input}`);
        this.specialty?.setValue(input);
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
    this.name?.setValue('');
    this.lastName?.setValue('');
    this.age?.setValue('');
    this.dni?.setValue('');
    this.specialty?.setValue('');
    this.email?.setValue('');
    this.password?.setValue('');
  }

  captchaResult(result: any) {
    this.captcha = result;
  }

  private checkPasswords(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const clave = formGroup.get('password');
      const repiteClave = formGroup.get('password2');
      const respuestaError = { noCoincide: 'La contraseña no coincide' };

      if (clave?.value !== repiteClave?.value) {
        formGroup.get('password2')?.setErrors(respuestaError);
        return respuestaError;
      } else {
        formGroup.get('password2')?.valid;
        return null;
      }
    };
  }
}

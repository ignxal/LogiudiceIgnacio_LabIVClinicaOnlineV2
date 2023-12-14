import { EventEmitter, Injectable } from '@angular/core';
import {
  Auth,
  User,
  applyActionCode,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';

import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserM } from '../models/user';
import { UserService } from './user.service';
import { FilesService } from './file.service';
import { CollectionsService } from './collections.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  collecionLogs = 'logs';
  loggedUser!: UserM | undefined;
  onUserLogged: EventEmitter<UserM> = new EventEmitter<UserM>();
  onUserLogout: EventEmitter<void> = new EventEmitter<void>();
  private userCredential!: User;

  constructor(
    private userService: UserService,
    private fileService: FilesService,
    private collectionService: CollectionsService,
    private auth: Auth,
    private router: Router
  ) {
    this.getUserFromStorage();
  }

  async registerUser(
    usuario: UserM,
    password: string,
    fotos: File[] | null
  ): Promise<{ result: boolean; error: string }> {
    try {
      usuario.registerDate = Timestamp.now();
      if (usuario.role === 'Admin') usuario.emailVerified = true;

      const exists = await this.userService.exists(usuario);

      if (exists) {
        return { result: false, error: 'La persona ya existe' };
      }

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        usuario.email,
        password
      );

      this.userCredential = userCredential.user;
      usuario.uid = userCredential.user.uid;

      const picturesURL: any = await this.fileService.updateImages(
        usuario.email,
        fotos
      );

      await updateProfile(this.auth.currentUser!, {
        displayName: usuario.name + ' ' + usuario.lastName,
        photoURL: picturesURL[0],
      });

      usuario.photoURL = picturesURL[0];
      usuario.imageUrl = [...picturesURL];

      await this.userService.addOne(usuario);

      return { result: true, error: '' };
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          return { result: false, error: 'Correo electrónico invalido' };
        case 'auth/email-already-in-use':
          return { result: false, error: 'Correo electrónico ya registrado' };
        case 'auth/invalid-password':
          return { result: false, error: 'Contraseña debil' };
        default:
          return { result: false, error: 'Error al registrarse' };
      }
    }
  }

  sendMailConfirmation() {
    sendEmailVerification(this.userCredential);
  }

  async activateAccount(oobCode: string) {
    console.log(oobCode);
    console.log(this.auth);
    await applyActionCode(this.auth, oobCode);

    this.userService.getOne(this.auth.currentUser!.uid).then((user) => {
      user.emailVerified = true;
      user.confirmationDate = Timestamp.now();

      this.userService.update(user);

      Swal.fire({
        icon: 'success',
        title: 'Verificación exitosa!',
        text: 'Redirigiendo al inicio de sesion!',
        timer: 1500,
      })
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  async loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return this.userService.getOne(userCredential.user.uid).then((user) => {
        if (user.emailVerified) {
          if (
            user.role !== 'Specialist' ||
            (user.role === 'Specialist' && user.approved)
          ) {
            this.loggedUser = user;
            this.setUserToStorage();
            this.logUser(user);

            return { result: true, error: '' };
          } else {
            return { result: false, error: 'El usuario no esta habilitado' };
          }
        } else {
          return {
            result: false,
            error: 'Primero debe confirmar su correo electrónico',
          };
        }
      });
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-email':
          return {
            result: false,
            error: 'Correo electrónico o contraseña incorrecta',
          };
        default:
          return { result: false, error: 'Error al iniciar sesion' };
      }
    }
  }

  async logoutUser() {
    try {
      await signOut(this.auth);
      this.loggedUser = undefined;
      this.deleteUserFromStorage();
      return { result: true, error: '' };
    } catch (error) {
      return { result: false, error: 'Error al cerrar sesion' };
    }
  }

  getUserFromStorage() {
    if (this.loggedUser === undefined) {
      try {
        const user = JSON.parse(
          localStorage.getItem('currentUser') || undefined!
        );
        if (user) {
          this.loggedUser = <UserM>user;
          this.onUserLogged.emit(this.loggedUser);
        }
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    } else {
      this.onUserLogged.emit(this.loggedUser);
    }
  }

  async logUser(user: UserM) {
    var auxDate = new Date().toLocaleString();
    var date = auxDate.split(',')[0];
    var time = auxDate.split(',')[1];
    let newLog: any = {
      uid: user.uid,
      displayName: user.name + ' ' + user.lastName,
      date: date,
      time: time,
    };

    return this.collectionService
      .addOne(this.collecionLogs, newLog)
      .then(() => {
        return true;
      })
      .catch((err: any) => {
        console.log(err);
        return false;
      });
  }

  getLogs() {
    return this.collectionService.getAllSnapshot<any>(
      this.collecionLogs,
      'date'
    );
  }

  setUserToStorage() {
    localStorage.setItem('currentUser', JSON.stringify(this.loggedUser));
    this.onUserLogged.emit(this.loggedUser);
  }

  deleteUserFromStorage() {
    localStorage.removeItem('currentUser');
    this.onUserLogout.emit();
  }
}

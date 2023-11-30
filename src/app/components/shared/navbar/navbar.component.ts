import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserM } from '../../../models/user';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentUser!: UserM | undefined;
  displayLoader: boolean = false;
  displayLoaderSub!: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.displayLoaderSub = this.loader.loaderState$.subscribe(
      (state) => (this.displayLoader = state)
    );

    this.auth.onUserLogged.subscribe((user) => {
      this.currentUser = user;
    });

    this.auth.onUserLogout.subscribe((e) => {
      this.currentUser = undefined;
    });

    this.auth.getUserFromStorage();
  }

  logout() {
    this.auth.logoutUser();
    this.currentUser = undefined;

    Swal.fire({
      icon: 'success',
      title: 'Cierre de sesion exitoso!',
      text: 'Te esperamos pronto!',
    }).then((r) => {
      this.router.navigate(['']);
    });
  }
}

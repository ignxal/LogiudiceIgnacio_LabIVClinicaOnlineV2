import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './components/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentStatusPipe } from './pipes/appointment-status.pipe';
import { HomeModule } from './components/home/home.module';
import { RolePipe } from './pipes/role.pipe';
import { SpecialtiesPipe } from './pipes/specialties.pipe';
import { SurveyValuesPipe } from './pipes/survey-values.pipe';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    AppointmentStatusPipe,
    RolePipe,
    SpecialtiesPipe,
    SurveyValuesPipe,
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth(getApp())),
    provideFirestore(() => getFirestore(getApp())),
    provideStorage(() => getStorage(getApp())),
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    HighchartsChartModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}

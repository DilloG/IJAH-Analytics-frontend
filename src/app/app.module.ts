import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { GoogleChartsModule } from 'angular-google-charts';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SynergiComponent } from './synergi/synergi.component';
import { ClusterComponent } from './cluster/cluster.component';
import { DrugtargetComponent } from './drugtarget/drugtarget.component';
import { DataTablesModule } from 'angular-datatables';
import { ContactusComponent } from './contactus/contactus.component';
import { ComsimilarComponent } from './comsimilar/comsimilar.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SynergiComponent,
    ClusterComponent,
    DrugtargetComponent,
    ContactusComponent,
    ComsimilarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    DataTablesModule,
    GoogleChartsModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

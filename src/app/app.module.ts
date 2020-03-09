import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@portinari/portinari-ui';
import { HttpModule } from '@angular/http';
import { ChartModule, ChartsModule } from '@progress/kendo-angular-charts';
import { PoPageLoginModule, PoModalPasswordRecoveryModule } from '@portinari/portinari-templates';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PrincipalComponent } from './principal/principal.component';
import { EquipeComponent } from './equipe/equipe.component';
import { RestJiraService } from './rest-jira.service';
import { RestZenService } from './rest-zen.service';
import { RestTrelloService } from './rest-trello.service';
import { AuthGuard } from './guards/auth.guard';
import { IndRejectPrimeModule } from './indrejectprime/indrejectprime.module';
import { IndPerfPrimeModule } from './indperfprime/indperfprime.module';
import { IndManutPrimeModule } from './indmanutprime/indmanutprime.module';
import { IndClienteModule } from './indcliente/indcliente.module';
import { BacklogManutPrimeModule } from './backlogmanutprime/backlogmanutprime.module';
import 'hammerjs';
import { GridModule } from '@progress/kendo-angular-grid';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';







@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    EquipeComponent
  ],
  imports: [
    BrowserModule,
    PoModule,
    PoPageLoginModule,
    PoModalPasswordRecoveryModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpModule,
    ChartModule,
    ChartsModule,
    IndRejectPrimeModule,
    IndPerfPrimeModule,
    IndManutPrimeModule,
    IndClienteModule,
    BacklogManutPrimeModule,
    GridModule,
    ExcelExportModule
  ],
  providers: [RestJiraService, AuthGuard, RestZenService, RestTrelloService],
  bootstrap: [AppComponent]
})
export class AppModule { }

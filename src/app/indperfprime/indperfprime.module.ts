import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule, ChartsModule } from '@progress/kendo-angular-charts';
import { PoModule } from '@portinari/portinari-ui';
import { PoDialogModule } from '@portinari/portinari-ui';
import { PoModalModule } from '@portinari/portinari-ui';
import { PoGridModule } from '@portinari/portinari-ui';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';

import { RestJiraService } from '../rest-jira.service';
import { AuthGuard } from '../guards/auth.guard';
import { IndperfprimeComponent } from '../indperfprime/indperfprime.component';

@NgModule({
    declarations: [
        IndperfprimeComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        ChartModule,
        ChartsModule,
        PoModule,
        PoGridModule,
        PoDialogModule,
        PoModalModule,
        GridModule,
        ExcelModule,
        PDFModule
    ],
    providers: [RestJiraService, AuthGuard]
})

export class IndPerfPrimeModule { }

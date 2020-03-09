import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule, ChartsModule } from '@progress/kendo-angular-charts';
import { PoDialogModule } from '@portinari/portinari-ui';
import { PoModule } from '@portinari/portinari-ui';
import { PoGridModule } from '@portinari/portinari-ui';

import { RestJiraService } from '../rest-jira.service';
import { AuthGuard } from '../guards/auth.guard';
import { IndrejectprimeComponent } from './indrejectprime.component';

@NgModule({
    declarations: [
        IndrejectprimeComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        ChartModule,
        ChartsModule,
        PoModule,
        PoGridModule,
        PoDialogModule
    ],
    providers: [RestJiraService, AuthGuard]
})

export class IndRejectPrimeModule { }

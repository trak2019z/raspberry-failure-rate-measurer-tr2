import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule, MatCardModule, MatInputModule, MatButtonModule, MatToolbarModule, MatSelectModule, MatTooltipModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule } from '@angular/material';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
    exports: [
        MatProgressSpinnerModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        MatSelectModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        AngularFontAwesomeModule,
    ]
})

export class AngularMaterialModule {}
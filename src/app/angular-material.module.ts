import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule, MatCardModule, MatInputModule, MatButtonModule, MatToolbarModule, MatSelectModule, MatTooltipModule } from '@angular/material';

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
        AngularFontAwesomeModule,
    ]
})

export class AngularMaterialModule {}
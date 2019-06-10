import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule, MatCardModule, MatInputModule, MatButtonModule, MatToolbarModule, MatSelectModule } from '@angular/material';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
    exports: [
        MatProgressSpinnerModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        MatSelectModule,
        AngularFontAwesomeModule,
    ]
})

export class AngularMaterialModule {}
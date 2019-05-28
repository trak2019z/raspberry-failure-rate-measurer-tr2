import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule, MatCardModule, MatInputModule, MatButtonModule, MatToolbarModule } from '@angular/material';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
    exports: [
        MatProgressSpinnerModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        AngularFontAwesomeModule,
    ]
})

export class AngularMaterialModule {}
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideToastr, ToastrModule } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideToastr({
      maxOpened: 3
    }), 
    importProvidersFrom(BrowserAnimationsModule),
    ...appConfig.providers || []
  ]
})
  .catch((err) => console.error(err));
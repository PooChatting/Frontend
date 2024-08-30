import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { APP_LAYOUT_ROUTES } from './layouts/routes/routes.component';

export const routes: Routes = [
    { path: '', component: AppLayoutComponent, children: APP_LAYOUT_ROUTES},
];
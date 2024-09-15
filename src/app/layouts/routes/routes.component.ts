import {Routes} from "@angular/router";
import { IsLoggedGuard } from "../../shared/utility/IsLoggedGuard";


export const APP_LAYOUT_ROUTES: Routes = [
  {
    path: 'dm/:id',
    canActivate: [IsLoggedGuard],
    loadComponent: () => import('../../views/direct-messages/direct-messages.component')
      .then(m => m.DirectMessagesComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('../../views/login/login.component')
      .then(m => m.LoginComponent)
  },

]
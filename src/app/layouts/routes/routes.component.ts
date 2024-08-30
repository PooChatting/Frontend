import {Routes} from "@angular/router";

export const APP_LAYOUT_ROUTES: Routes = [
  {
    path: 'dm/:id',
    loadComponent: () => import('../../views/direct-messages/direct-messages.component')
      .then(m => m.DirectMessagesComponent)
  },

]
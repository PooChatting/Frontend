import { inject } from "@angular/core"
import { AuthService } from "../../services/account/auth.service"
import { CanActivateFn, Router } from "@angular/router"

export const IsLoggedGuard: CanActivateFn = () =>  {
  const isLoggedIn : boolean = inject(AuthService).isLoggedIn
  
  if (isLoggedIn) { return true }
  
  return inject(Router).navigate(['login']);
}

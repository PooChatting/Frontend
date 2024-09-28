import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./account/auth.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class AuthHeader {

  private authService = inject(AuthService)
  
  getAuthenticationHeader(): HttpHeaders {
    let headers = new HttpHeaders
    let jwtData = this.authService.getJwtData()
    if(jwtData == null){
      headers = headers.set("Authorization", "")
    }
    else{
      headers = headers.set('Authorization', `Bearer ${jwtData!.jwtToken}`)
    }
    return headers
  }
}

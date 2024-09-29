import {HttpClient} from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { AuthHeader } from "../authenticationHeader.service";
import { AuthService } from "../account/auth.service";

@Injectable({
  providedIn: 'root'
})

export class ChannelService {

  private httpClient = inject(HttpClient)
  private authHeader = inject(AuthHeader)

  addToChannel(channelId: string) {
    return this.httpClient
      .put(
        `${environment.apiUrl}/channel/${channelId}/user`, "",
        {headers: this.authHeader.getAuthenticationHeader()})
  }

}

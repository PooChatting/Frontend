import { Observable, tap } from "rxjs";
import {HttpClient} from "@angular/common/http";
import { LoginDto } from "../../shared/dtos/LoginDto";
import { AuthData } from "../../shared/dtos/AuthData";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { RegisterDto } from "../../shared/dtos/RegisterDto";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private httpClient = inject(HttpClient)

  login(dto: LoginDto): Observable<AuthData> {
    return this.httpClient
      .post<AuthData>(
        `${environment.apiUrl}/auth/login`,
        dto,
        {responseType: "json",})
      .pipe(tap((res) => this.saveJwtData(res)));
  }

  register(dto: RegisterDto): Observable<AuthData> {
    return this.httpClient
      .post<AuthData>(
        `${environment.apiUrl}/auth/register`,
        dto,
        {responseType: "json",})
  }
  
  saveJwtData(jwtData: AuthData) {
    localStorage.setItem("jwtUserData", JSON.stringify(jwtData));
  }

  getJwtData(): AuthData | null {
    const dataString: string | null = localStorage.getItem("jwtUserData")
    return dataString ? JSON.parse(dataString) : null;
  }

  get isLoggedIn(): boolean {
    return this.getJwtData() != null;
  }
}

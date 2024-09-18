import { Component, ViewChild} from '@angular/core';
import { MonkeyComponent } from "../../components/monkey/monkey.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MonkeyComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild(MonkeyComponent) monkeyComponent!: MonkeyComponent;

  emailValidatior = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

  spinAnimation = false

  loginInputIndex = "1"
  registerInputIndex = "0"
  firstBarColor = "rgb(92, 92, 92)"
  secondBarColor = "rgb(92, 92, 92)"
  thirdBarColor = "rgb(92, 92, 92)"
  fourthBarColor = "rgb(92, 92, 92)"

  changeType() {
    this.spinAnimation = true
    setTimeout(() => {
      this.loginInputIndex = this.loginInputIndex == "1" ? "0" : "1"
      this.registerInputIndex = this.registerInputIndex == "1" ? "0" : "1"
      setTimeout(() => {
        this.spinAnimation = false
      }, 500);
    }, 500);
  }

  passwordInput(input: string) {
    let conditions = 0
    if (input.length >= 8) {
      conditions += 1
    }
    // Check if password contains numbers
    if (/\d/.test(input)) {
      conditions += 1
    }
    // Check if password contains uppercase letters
    if (/[A-Z]/.test(input)) {
      conditions += 1
    }
    // Check if password contains special characters
    if (/[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(input)) {
      conditions += 1
    }
    this.lightUpPasswordBar(conditions)
  }

  lightUpPasswordBar(conditions: number) {
    this.firstBarColor = conditions >= 1 ? "rgb(255, 0, 0)" : "rgb(92, 92, 92)"
    this.secondBarColor = conditions >= 2 ? "orange" : "rgb(92, 92, 92)"
    this.thirdBarColor = conditions >= 3 ? "greenyellow" : "rgb(92, 92, 92)"
    this.fourthBarColor = conditions == 4 ? "green" : "rgb(92, 92, 92)"
  }

  registerAccount(email: string, password: string, confirmPassword: string) {
    if (!this.emailValidatior.test(email)){
      // Send Notification
      // "Not correct email"
    }
    else if (password.length < 8 ){
      // Send Notification
      // "Password must be at least 8 characters long"
    }
    else if (confirmPassword != password || confirmPassword == ""){
      // Send Notification
      // "Passwords don't match"
    }
    else{
      // Send To Server
    }
  }

  loginAccount(email: string, password: string){
    // (Will propably scrap this if)
    if (email == "" || !this.emailValidatior.test(email) || password == "" || password.length < 8){
      // Send Notification
      // "Invalid login"
    }
    else{
      // Send To Server
    }
  }

}

import { Component, ElementRef} from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  emailValidatior = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

  leftArmOverHead = false
  rightArmOverHead = false
  leftEyePosition = {top: "100px", left: "163px"}
  rightEyePosition = {top: "100px", left: "228px"}
  firstBarColor = "rgb(92, 92, 92)"
  secondBarColor = "rgb(92, 92, 92)"
  thirdBarColor = "rgb(92, 92, 92)"
  fourthBarColor = "rgb(92, 92, 92)"
  spinAnimation = false
  loginInputIndex = "1"
  registerInputIndex = "0"

  onFocus() {
    this.leftArmOverHead = true
    this.rightArmOverHead = true
  }

  onFocusOut() {
    this.leftArmOverHead = false
    this.rightArmOverHead = false
    this.resetEyePosition()
  }

  onInput(text: string) {
    this.leftEyePosition.top = "103px"
    this.rightEyePosition.top = "103px"
    if (text.length >= 26) {
      this.leftEyePosition.left = "168px"
      this.rightEyePosition.left = "233px"
    }
    else {
      this.leftEyePosition.left = `${160 + text.length * 0.3}px`
      this.rightEyePosition.left = `${225 + text.length * 0.3}px`
    }
  }

  changeType() {
    this.resetEyePosition()
    this.spinAnimation = true
    setTimeout(() => {
      this.loginInputIndex = this.loginInputIndex == "1" ? "0" : "1"
      this.registerInputIndex = this.registerInputIndex == "1" ? "0" : "1"
      setTimeout(() => {
        this.spinAnimation = false
      }, 500);
    }, 500);
  }

  resetEyePosition() {
    this.leftEyePosition.left = "163px"
    this.rightEyePosition.left = "228px"
    this.leftEyePosition.top = "100px"
    this.rightEyePosition.top = "100px"
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

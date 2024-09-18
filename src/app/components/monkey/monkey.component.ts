import { Component, HostListener, Input, input } from '@angular/core';

@Component({
  selector: 'app-monkey',
  standalone: true,
  imports: [],
  templateUrl: './monkey.component.html',
  styleUrl: './monkey.component.scss'
})
export class MonkeyComponent {
  @Input() spinAnimation: boolean = false;


  leftArmOverHead = false
  rightArmOverHead = false
  leftEyePosition = {top: "100px", left: "163px"}
  rightEyePosition = {top: "100px", left: "228px"}
  isInputingValues = false


  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e: MouseEvent) {
    if (!this.isInputingValues) {
      this.leftEyePosition.top = `${Math.floor(e.clientY / (window.innerHeight / 18)) + 101}px`
      this.rightEyePosition.top = `${Math.floor(e.clientY / (window.innerHeight / 18)) + 101}px`
      this.leftEyePosition.left = `${Math.floor(e.clientX / (window.innerWidth / 15)) + 156}px`
      this.rightEyePosition.left = `${Math.floor(e.clientX / (window.innerWidth / 15)) + 221}px`
    }
  }

  onFocus() {
    this.isInputingValues = true
    this.leftArmOverHead = true
    this.rightArmOverHead = true
  }

  onFocusOut() {
    this.isInputingValues = false
    this.leftArmOverHead = false
    this.rightArmOverHead = false
  }

  onInput(text: string) {
    this.isInputingValues = true
    this.leftEyePosition.top = "119px"
    this.rightEyePosition.top = "119px"
    if (text.length >= 26) {
      this.leftEyePosition.left = "168px"
      this.rightEyePosition.left = "233px"
    }
    else {
      this.leftEyePosition.left = `${160 + text.length * 0.3}px`
      this.rightEyePosition.left = `${225 + text.length * 0.3}px`
    }
  }
}

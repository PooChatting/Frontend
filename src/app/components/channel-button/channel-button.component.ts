import { Component, HostListener, inject, Input } from '@angular/core';
import { ChannelDto } from '../../shared/dtos/ChannelDto';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-channel-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './channel-button.component.html',
})
export class ChannelButtonComponent {
  @Input({ required: true }) channel: ChannelDto | undefined
  isUserHovering = false
  tagPostion = {x: 0, y: 0}

  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e: MouseEvent) {
    this.tagPostion.x = e.x
    this.tagPostion.y = e.y
  }
}

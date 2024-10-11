import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { shareTypeEnum } from '../../shared/enums/ShareTypeEnum';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './share.component.html',
})
export class ShareComponent {
  @Output() Share = new EventEmitter<shareTypeEnum>();

  TwitterType = shareTypeEnum.Twitter
  TelegramType = shareTypeEnum.Telegram
  EmailType = shareTypeEnum.Email
}

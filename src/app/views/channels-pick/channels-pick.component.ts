import { Component, inject } from '@angular/core';
import { ChannelService } from '../../services/channel/channel.service';
import { ChannelDto } from '../../shared/dtos/ChannelDto';
import { tap } from 'rxjs';
import { ChannelButtonComponent } from '../../components/channel-button/channel-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-channels-pick',
  standalone: true,
  imports: [CommonModule, ChannelButtonComponent],
  templateUrl: './channels-pick.component.html',
})
export class ChannelsPickComponent {
  private channelService = inject(ChannelService)
  channelslist: ChannelDto[] = []

  ngOnInit(){
    this.channelService.getUserChannels().pipe(tap(x => {
      this.channelslist = x
      console.log(this.channelslist);
      
    })).subscribe()  
  }
}

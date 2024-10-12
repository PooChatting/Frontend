import { messageTypeEnum } from "../enums/MessageTypeEnum";

export interface PostMessageDto {
    channelId : string,
    messageText : string,
    messageTypeEnum : messageTypeEnum,
    replyToId?: number
  }
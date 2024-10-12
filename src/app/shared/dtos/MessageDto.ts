import { messageTypeEnum } from "../enums/MessageTypeEnum";

export interface MessageDto {
  id : number,
  authorId : number,
  authorName : string,
  authorProfile : string,
  channelId : number,
  messageText : string,
  publication : string,
  wasEdited : boolean,
  messageTypeEnum: messageTypeEnum
  replyToId?: number
}
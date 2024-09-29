export interface MessageDto {
  id : number,
  authorId : number,
  authorName : string,
  authorProfile : string,
  channelId : number,
  messageText : string,
  publication : Date,
  wasEdited : number
}
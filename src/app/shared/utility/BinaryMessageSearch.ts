import { TextMessageComponent } from "../../components/text-message/text-message.component";

export function BinaryMessageSearchOnScreen(messages: TextMessageComponent[], curViewportOffset: number) {
  let lastIndex = -1
  let curIndex = messages.length-1
  for (let times = 2; times >= 0; times*=2) {
    if(messages[curIndex].getOffsetHeight() < curViewportOffset){
      curIndex = Math.floor(curIndex + ((messages.length-1)/times))
      if (curIndex == lastIndex) {
        curIndex + 1
      }
    }
    else{
      curIndex = Math.floor(curIndex - ((messages.length-1)/times))
      if (curIndex == lastIndex) {
        curIndex - 1
      }
    }
    if (lastIndex == curIndex) {
      return curIndex
    }
    lastIndex = curIndex
  }
  return 0
}

export function BinaryMessageSearchById(messages: TextMessageComponent[], messageId: number) {
  console.log(messageId);
  let lastIndex = -1
  let curIndex = messages.length-1
  for (let times = 2; times >= 0; times*=2) {
    if(messages[curIndex].messageDto.id < messageId){
      curIndex = Math.floor(curIndex + ((messages.length-1)/times))
      if (curIndex == lastIndex) {
        curIndex += 1
      }
    }
    else{
      curIndex = Math.floor(curIndex - ((messages.length-1)/times))
      if (curIndex == lastIndex) {
        curIndex -= 1
      }
    }
    if (messages[curIndex].messageDto.id == messageId ) {
      return curIndex
    }
    lastIndex = curIndex
  }
  return 0
}
import { UserDto } from "./UserDto";

export interface ChannelDto {
    id: number;
    otherUserInChannel: UserDto
}
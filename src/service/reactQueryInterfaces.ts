import { ReactionType } from "../util/ReactionType";

export interface ReactionRequest {
    postId : string;
    reactionType : ReactionType
}

export interface CreateChat {
    participantIds: string[],
    name?: string
}

export interface LeaveOrRemoveParticipant {
    chatId: string,
    participantId: string
}
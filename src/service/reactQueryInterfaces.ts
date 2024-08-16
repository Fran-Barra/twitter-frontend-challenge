import { ReactionType } from "../util/ReactionType";

export interface ReactionRequest {
    postId : string;
    reactionType : ReactionType
}
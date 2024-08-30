import { useMutation, useMutationState, useQuery, useQueryClient } from "@tanstack/react-query"
import { useHttpRequestService } from "./HttpRequestService"
import { staleTimeForPost } from "../util/Constants";
import { CreateChat, LeaveOrRemoveParticipant, ReactionRequest } from "./reactQueryInterfaces";


//TODO: the data should not be passed here, but in the mutation when calling mutation, Should use the Options interface
interface MutationOptions<T> {
    readonly data: T,
    readonly onSuccess?: ((data: any, variables: void, context: unknown) => Promise<unknown> | unknown) | undefined,
    readonly onError?: ((data: any, variables: void, context: unknown) => Promise<unknown> | unknown) | undefined,
}

interface Options<TVariables> {
    readonly onSuccess?: ((data: any, variables: TVariables, context: unknown) => Promise<unknown> | unknown) | undefined,
    readonly onError?: ((data: any, variables: TVariables, context: unknown) => Promise<unknown> | unknown) | undefined,
}


//TODO: fix this, almost all hooks are being call more times than necessary? (I have seen in all places that mutations are used like this
//so it might not be true, investigate farther)
const useReactQueryProxy = () => {
    const httpService = useHttpRequestService()
    const queryClient = useQueryClient();

    return {
        useMe: () => useQuery({
            queryKey: ['me'],
            queryFn: httpService.me,
            staleTime: Infinity
        }),

        useFollowUser: (options: MutationOptions<{userId: string}>) => useMutation({
            mutationFn: () => httpService.followUser(options.data.userId),
            onSuccess: (data: any, variables: void, context: unknown) => {
                queryClient.invalidateQueries({queryKey: ['me']})
                if (options.onSuccess) options.onSuccess(data, variables, context)
            },
            onError: options.onError
        }),

        useUnfollowUser: (options: MutationOptions<{userId: string}>) => useMutation({
            mutationFn: () => httpService.unfollowUser(options.data.userId),
            onSuccess: (data: any, variables: void, context: unknown) => {
                queryClient.invalidateQueries({queryKey: ['me']})                
                if (options.onSuccess) options.onSuccess(data, variables, context)
            },
            onError: options.onError
        }),

        usePostProfilePicture: (options: Options<File>) => useMutation({
            mutationFn: httpService.postProfilePicture,
            onSuccess: (data: any, variables: File, context: unknown) => {
                queryClient.invalidateQueries({queryKey: ['me']})
                if (options.onSuccess) options.onSuccess(data, variables, context)
            },
            onError: options.onError
        }),


        //TODO: check that is working correctly. (create reaction and delete reaction call the get, but I think the stash is not working)
        useGetPostById: (postId: string) => useQuery({
            queryKey: ['post', postId],
            queryFn: () => httpService.getPostById(postId),
            staleTime: staleTimeForPost
        }),

        useCreateReaction: (options: Options<ReactionRequest>) => useMutation({
            mutationFn: (data : ReactionRequest) => httpService.createReaction(data.postId, data.reactionType),
            onSuccess: (data: any, variables: ReactionRequest, context: unknown) => {
                queryClient.invalidateQueries({queryKey: ['post', variables.postId]})
                if (options.onSuccess) options.onSuccess(data, variables, context)
            },
            onError: options.onError
        }),

        useDeleteReaction: (options: Options<ReactionRequest>) => useMutation({
            mutationFn: (data: ReactionRequest) => httpService.deleteReaction(data.postId, data.reactionType),
            onSuccess: (data: any, variables: ReactionRequest, context: unknown) => {
                queryClient.invalidateQueries({queryKey: ['post', variables.postId]})
                if (options.onSuccess) options.onSuccess(data, variables, context)
            },
            onError: options.onError
        }),


        useGetPosts: (following: boolean, limit: number, after?: string) => useQuery({
            queryKey: ['feed', following, limit, after],
            queryFn: () => httpService.getPosts(following, limit, after),
            staleTime: staleTimeForPost
        }),


        useGetChats: () => useQuery({
            queryKey: ['chats'],
            queryFn: ()=>httpService.getChats(),
            staleTime: Infinity
        }),
        
        useCreateNewChat: (options: Options<CreateChat>) => useMutation({
            mutationFn: (data: CreateChat) => httpService.createChat(data.participantIds, data.name),
            onSuccess: (data: any, variables: CreateChat, context: unknown) => {
                queryClient.invalidateQueries({queryKey: ['chats']})
                options.onSuccess &&  options.onSuccess(data, variables, context)
            },
            onError: options.onError
        }),

        useDeleteChat: (options: Options<string>) => useMutation({
            mutationFn: (chatId: string) => httpService.deleteChat(chatId),
            onSuccess: (data: any, variables: string, context: unknown) => {
                queryClient.invalidateQueries({queryKey: ['chats']})
                options.onSuccess &&  options.onSuccess(data, variables, context)
            },
            onError: options.onError
        }),

        //TODO: if possible to get me, only invalidate if user is me
        useLeaveOrRemoveParticipant: (options: Options<LeaveOrRemoveParticipant>) => useMutation({
            mutationFn: (data: LeaveOrRemoveParticipant) => httpService.leaveOrRemoveParticipant(data.chatId, data.participantId),
            onSuccess: (data: any, variables: LeaveOrRemoveParticipant, context: unknown) => {
                queryClient.invalidateQueries({queryKey: ['chats']})
                options.onSuccess &&  options.onSuccess(data, variables, context)
            },
            onError: options.onError
        })

        //TODO: add participant
    }
}

export default useReactQueryProxy
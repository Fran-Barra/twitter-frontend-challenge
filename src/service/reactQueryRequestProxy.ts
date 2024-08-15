import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useHttpRequestService } from "./HttpRequestService"
import { staleTimeForPost } from "../util/Constants";
import { ReactionRequest } from "./reactQueryInterfaces";


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
        })
        
    }
}

export default useReactQueryProxy
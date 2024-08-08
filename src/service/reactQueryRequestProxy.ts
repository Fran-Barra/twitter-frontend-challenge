import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useHttpRequestService } from "./HttpRequestService"


interface MutationOptions<T> {
    data: T,
    onSuccess?: ((data: any, variables: void, context: unknown) => Promise<unknown> | unknown) | undefined,
    onError?: ((data: any, variables: void, context: unknown) => Promise<unknown> | unknown) | undefined,
}

const useReactQueryProxy = () => {
    const httpService = useHttpRequestService()
    const queryClient = useQueryClient();

    return {
        useMe: () => useQuery({
            queryKey: ['me'],
            queryFn: httpService.me
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
    }
}

export default useReactQueryProxy
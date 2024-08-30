import { StyledContainer } from "../../components/common/Container"
import { StyledH3, StyledP } from "../../components/common/text"
import { Author, ChatDTO, MessageDTO } from "../../service"
import Icon from "../../assets/icon.jpg";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageInput from "../../components/message-input/MessageInput";
import useReactQueryProxy from "../../service/reactQueryRequestProxy";
import { Socket } from "socket.io-client";
import { SocketIOEvent } from "../../service/SocketIOEvent";
import React from "react";
import Avatar from "../../components/common/avatar/Avatar";


interface ChatPageProps {
    chat : ChatDTO;
    socket: Socket;
}

interface ChatMessageProps {
    message: MessageDTO;
    sender: Author;
    localUser: boolean;
}

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>((
    {message, sender, localUser} : ChatMessageProps, ref) => {
    return (
        <StyledContainer
            ref={ref}
            background={localUser ? "rgb(74, 153, 233)" : "lightGray"} 
            padding={localUser ? "5px" : "0px 5px 5px 5px"} 
            width={"auto"}
            height={"auto"}
            margin={localUser ? "0px 5px 0px 30px" : "0px 30px 0px 5px"}
            borderRadius={"5px"}
        >
            {!localUser &&
                <StyledContainer 
                    display={"flex"}
                    flexDirection={"row"}
                    gap={"10px"}
                    alignItems={"center"}
                    height={"auto"}
                    >
                    <Avatar src={sender.profilePicture ?? Icon}  height={"30px"} width={"30px"} alt={"Icon"} />
                    <p>{sender.username}</p>
                </StyledContainer>
            }
            <StyledP primary>{message.message}</StyledP>
            {/* <StyledP primary={false}>{new Date(message.createdAt.toString()).toISOString()}</StyledP> */}
        </StyledContainer>
    )
})

const ChatPage = ({chat, socket} : ChatPageProps) => {
    const observer = useRef<IntersectionObserver>();
    const messagesContainer = useRef<HTMLDivElement>(null);

    const [afterMessage, setAfterMessage] = useState<string | null>(null)
    const [goDown, setGoDown] = useState<boolean>(true)

    const chatUsers = useRef<Map<string, Author>>(new Map([
        ...chat.participants.map(u => [u.id, u] as [string, Author]), [chat.owner.id, chat.owner]
    ]));

    const [messages, setMessages] = useState<MessageDTO[]>([])
    const httpService = useReactQueryProxy()

    const {data: me} = httpService.useMe()

    useEffect(() => {
        socket.on(SocketIOEvent.GET_MESSAGES, onFirstGotOlderMessages)
        socket.on(SocketIOEvent.MESSAGE, onNewMessage)

        return () => {
            socket.off(SocketIOEvent.GET_MESSAGES)
            socket.off(SocketIOEvent.MESSAGE)
        }
    }, [])

    useEffect(() => {
        setMessages([])
    }, [chat])

    const getOlderMessages = () => {
        //TODO: it seems that I am calling emit GET_MESSAGES from one place where i am not in a chat
        socket.emit(SocketIOEvent.GET_MESSAGES, {limit: 10, after: afterMessage})
    }

    const onFirstGotOlderMessages = (olderMessages : MessageDTO[]) => {
        updateListWithOlderMessages(true, olderMessages)

        socket.off(SocketIOEvent.GET_MESSAGES, onFirstGotOlderMessages)
        socket.on(SocketIOEvent.GET_MESSAGES, onGotOlderMessages)
    }

    const onGotOlderMessages = (olderMessages : MessageDTO[]) => {
        updateListWithOlderMessages(false, olderMessages)   
    }

    const updateListWithOlderMessages = (setDown : boolean, olderMessages : MessageDTO[]) => {        
        if (olderMessages.length === 0) return
        setGoDown(setDown);

        const reversedOlderMessages = olderMessages.reverse()
        
        if (reversedOlderMessages[0].id === afterMessage) return
        setMessages(actual => {
            //the order of making the map is important
            const map = new Map(reversedOlderMessages.map(m=>[m.id,m]))
            actual.forEach(m=>map.set(m.id, m))
            return Array.from(map.values())
        })
        setAfterMessage(reversedOlderMessages[0].id)   
    }

    const onNewMessage = (message: MessageDTO) => {
        if (!goDown) setGoDown(true);
        setMessages(messages => {return [...messages, message]})
    }

    const displayMessages = () => {        
        return messages.map((m,i)=>{
            const sender = chatUsers.current.get(m.userId)                  
            return sender && 
                <ChatMessage
                    ref={i === 0 ? lastMessageRef : undefined} 
                    key={m.id} message={m} 
                    sender={sender} 
                    localUser={m.userId === me?.id}
                />
        })
    }

    const handleSendMessage = (message : string) => {
        if (!me) return
        socket.emit(SocketIOEvent.MESSAGE, message)
        setGoDown(true)
        setMessages(prev => {
            return [
                ...prev,
                {
                    id: Math.random().toString(),
                    message: message,
                    createdAt: new Date(),
                    chatId: chat.id,
                    userId: me.id,
                    sender: {
                        id: me.id,
                        username: me.username,
                        private: me.private,
                        createdAt: me.createdAt,
                        follows: false
                    }
                }
            ]
        })
    }


    useEffect(() => {        
        if (!messagesContainer || !messagesContainer.current || !goDown) return
        messagesContainer.current.scrollTop = messagesContainer.current?.scrollHeight;        
    }, [messages]);

    const lastMessageRef = useCallback((node : HTMLDivElement) => {
        if (!node || messages.length === 0) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                getOlderMessages();
            }
        });

        if (node) observer.current.observe(node);
    }, [getOlderMessages, messages.length])

    return (
        <StyledContainer 
            maxWidth={'600px'} 
            borderRight={"1px solid #ebeef0"} 
            justifyContent={'space-between'} 
            paddingBottom={'10px'}
        >
            <StyledContainer 
                height={"auto"} 
                borderBottom={"1px solid #ebeef0"} 
                justifyContent={"center"}
                padding={"10px 0px 10px 0px"}
            >
                <StyledH3>{chat.name}</StyledH3>
            </StyledContainer>
            <StyledContainer 
                ref={messagesContainer}
                height={"100%"} 
                gap={"5px"} 
                overflowY={"auto"}
            >
                {displayMessages()}
            </StyledContainer >
            <MessageInput onSubmit={handleSendMessage}/>
        </StyledContainer>
    )
}

export default ChatPage
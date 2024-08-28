import { useEffect, useState } from "react"
import { StyledContainer } from "../../components/common/Container"
import { useHttpRequestService } from "../../service/HttpRequestService"
import { ChatDTO } from "../../service"
import { t } from "i18next"
import { StyledP } from "../../components/common/text"
import ChatPage from "./ChatPage"
import { io, Socket } from "socket.io-client"
import { SocketIOEvent } from "../../service/SocketIOEvent"

interface ChatBoxProps {
    chat : ChatDTO;
    selected : Boolean
    onClick : () => void;
}


const ChatBox = ({chat, selected, onClick}: ChatBoxProps) => {
    const lastMessage = () => {
        if (chat.messages && chat.messages.length > 0) return chat.messages[0].message
        return t('chat.group-created')
    }

    const lastUpdate = () => {
        if (chat.messages && chat.messages.length > 0) return chat.messages[0].createdAt.toISOString()
        if (chat.createdAt) return chat.createdAt.toISOString()
        return t(`chat.not-latest-update`)
    }    

    //TODO: ask how to do the selected color part
    //TODO: should the border color be in a const or how that is managed?
    return (
        <StyledContainer 
            borderBottom={"1px solid #ebeef0"} 
            backgroundColor={selected ? "lightGray" : "white"}
            maxHeight={"60px"} 
            paddingTop={"5px"} 
            onClick={onClick}
        >
            <StyledContainer
                maxHeight={"20px"} 
                alignItems={"center"}
                flexDirection={"row"} 
                justifyContent={"space-between"} 
                padding={"10px"}
            >
                <StyledP primary>{chat.name}</StyledP>
                <StyledP primary={false}>{lastUpdate()}</StyledP>
            </StyledContainer>
            <StyledContainer 
                maxHeight={"20px"}
                alignItems={"center"}
                flexDirection={"row"}
                padding={"10px"}
                gap={"5px"}
            >
                <StyledP primary>{t('chat.message')}</StyledP>
                <StyledP primary={false}>{lastMessage()}</StyledP>
            </StyledContainer>
        </StyledContainer>
    )
}


//TODO: use hook for chats or react query
//TODO: move out socket logic to a service.
const MessagesPage = () => {
    const [currentChat, setCurrentChat] = useState<ChatDTO | null>(null)
    const [chats, setChats] = useState<ChatDTO[]>([])
    const [socket, setSocket] = useState<Socket | null>(null)
    const service = useHttpRequestService()

    useEffect(()=>{
        service.getChats().then((res)=>{
            console.log(res);
            setChats(res)
        })

        const newSocket = io(process.env.REACT_APP_API_URL || '', {
            auth: { token: localStorage.getItem("token")}
        })        

        newSocket.on('connection', ()=>console.log('connected to socket'))
        newSocket.on('disconnect', (reason)=>console.log(reason));
    
        setSocket(newSocket)

        return () => {
            if (newSocket) newSocket.disconnect();
        }
    }, [])

    const chatSelected = (chat : ChatDTO) => {
        if (socket) {
            socket.emit(currentChat === chat ? SocketIOEvent.LEFT_CHAT : SocketIOEvent.JOIN_CHAT, chat.id, {limit: 20})
            setCurrentChat(currentChat === chat ? null : chat)
        } else {
            console.error("socket not connected");
        }
    }


    return (
        <>
            <StyledContainer maxWidth={'600px'} borderRight={"1px solid #ebeef0"}>
                {chats.map(c=><ChatBox key={c.id} chat={c}  selected={currentChat===c} onClick={()=>chatSelected(c)}/>)}
            </StyledContainer>
            {
                (currentChat !== null && socket !== null ) && 
                <ChatPage chat={currentChat} socket={socket} />
            }
        </>
    )
}

export default MessagesPage
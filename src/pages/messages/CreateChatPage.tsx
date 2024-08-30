import { t } from "i18next"
import { StyledContainer } from "../../components/common/Container"
import { StyledSearchBarInput } from "../../components/search-bar/SearchBarInput"
import { useHttpRequestService } from "../../service/HttpRequestService"
import React, { ChangeEvent, useContext, useState } from "react"
import { Author } from "../../service"
import Avatar from "../../components/common/avatar/Avatar"
import Icon from '../../assets/icon.jpg'
import UserDataBox from "../../components/user-data-box/UserDataBox"
import { StyledH3, StyledP } from "../../components/common/text"
import Button from "../../components/button/Button"
import { ButtonType } from "../../components/button/StyledButton"
import { StyledModalContainer } from "../../components/modal/ModalContainer"
import { StyledBlurredBackground } from "../../components/common/BlurredBackground"
import { StyledInputElement } from "../../components/labeled-input/StyledInputElement"
import { StyledModalInputContainer } from "../../components/labeled-input/ModalInputContainer"
import { createPortal } from "react-dom"
import ToastContext from "../../components/toast/ToastContext"
import { ToastType } from "../../components/toast/Toast"



interface CreateChatPageProps {
    onFinished?: () => void
}

interface NewParticipantProps {
    author: Author;
    onClick: () => void
}

const NewParticipant = ({author, onClick} : NewParticipantProps) => {
    return (
        <StyledContainer>
            <Avatar 
                key={author.id} 
                src={author.profilePicture ?? Icon} 
                alt={author.username} 
                onClick={onClick}
            />
            <StyledP primary={false}>{author.username}</StyledP>
        </StyledContainer>
    )
}

const CreateChatPage = ({onFinished} : CreateChatPageProps) => {
    const service = useHttpRequestService()
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<Author[]>([]);
    const [participants, setParticipants] = useState<Author[]>([])
    const [name, setName] = useState<string | undefined>(undefined)

    const {createToast} = useContext(ToastContext)

    const [popUpSetName, setPopUpSetName] = useState<boolean>(false)
    let debounceTimer: NodeJS.Timeout;

    const createChat = () => {
        service.createChat(participants.map(p=>p.id), name)
            .then((r)=>{
                createToast(t('chat.created-successfully'), ToastType.INFO)
                if (onFinished) onFinished()
            })
            .catch((e)=>{
                if (e?.response?.status === 403) createToast(t('chat.follow-followback'), ToastType.ALERT)
                else createToast(t('error.post-chat'), ToastType.ALERT)
                if (onFinished) onFinished()
            })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputQuery = e.target.value;

        setQuery(inputQuery);
    
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          try {
            setResults(await service.searchUsers(inputQuery, 4, 0));
          } catch (error) {
            console.log(error);
          }
        }, 300);
    }

    const onRemoveParticipant = (id : string) => {
        setParticipants(value => {
            return value.filter(p => p.id !== id)
        })
    }

    const onAddParticipant = (author : Author) => {
        setParticipants(values => {
            const map = new Map<string, Author>(values.map(p=>[p.id, p]))
            return Array.from<Author>(map.set(author.id, author).values())
        })
    }

    const handleCreate = () => {
        if (participants.length === 0) return 
        if (participants.length === 1) createChat()
        else setPopUpSetName(true)
    }

    const handleButtonClickFromPopUp = () => {
        createChat()
        setPopUpSetName(false)
    }

    //TODO: using formilk here would be an overkiller?
    const validName : () => boolean = () => {
        if (!name) return false
        return name.length > 3 && name.length < 20
    }

    const handleModalNameChange = (event : React.ChangeEvent<HTMLInputElement>) => {        
        setName(event.target.value)
    }

    return (
        <StyledContainer borderRight={"1px solid #ebeef0"}>
            <StyledContainer display={"flex"} flexDirection={"row"} height={"auto"} alignItems={"center"}>
                <StyledSearchBarInput 
                    onChange={handleChange}
                    value={query}
                    placeholder={t("placeholder.search")}
                />
                <Button
                    text={t('chat.create-short')} 
                    buttonType={participants.length === 0 ? ButtonType.DISABLED : ButtonType.DEFAULT} 
                    size={"auto"} 
                    onClick={handleCreate}
                />
            </StyledContainer>
            <StyledContainer 
                display={"flex"} 
                flexDirection={"row"}
                overflowX = {"auto"}
                height={"auto"}
                borderBottom={"1px solid #ebeef0"}
                padding={"5px 0px 5px 0px"}
            >
                {
                    participants.map(p => <NewParticipant key={p.id} author={p} onClick={()=>onRemoveParticipant(p.id)}/>)
                }
            </StyledContainer>
            <StyledContainer overflowX={"auto"}>
                {
                    results.map(author => 
                        <UserDataBox
                            key={author.id}
                            username={author.username}
                            name={author.name!}
                            id={author.id}
                            profilePicture={author.profilePicture!}
                            onClick={()=>onAddParticipant(author)}
                      />
                    )
                }
            </StyledContainer>
            {
                //TODO: consider making a modal from this
                popUpSetName && createPortal(
                    <StyledBlurredBackground>
                        <StyledModalContainer>
                            <StyledContainer width={"100%"} gap={"10px"} alignItems={"center"}>
                                <StyledH3>{t('chat.choose-name')}</StyledH3>
                                <StyledModalInputContainer>
                                    <StyledInputElement type={"text"} required={true} onChange={handleModalNameChange}/>
                                </StyledModalInputContainer>
                                <Button
                                    text={t('chat.create-short')}
                                    buttonType={validName() ? ButtonType.DEFAULT : ButtonType.DISABLED}
                                    size={"30%"}
                                    onClick={handleButtonClickFromPopUp}
                                />
                            </StyledContainer>
                        </StyledModalContainer>
                    </StyledBlurredBackground>,
                    document.body
                )
            }
        </StyledContainer>
    )
}

export default CreateChatPage
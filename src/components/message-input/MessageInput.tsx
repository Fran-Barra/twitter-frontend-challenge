import {useState, ChangeEvent } from "react";
import { StyledTextArea } from "./StyledTextArea"
import { t } from "i18next";
import { SendIcon } from "../../components/icon/Icon"
import { StyledContainer } from "../common/Container";

interface MessageInputProps {
    onSubmit: (content : string) => void;
}

const MessageInput = ({onSubmit} : MessageInputProps) => {
    const [content, setContent] = useState<string>('')

    const handleSubmit = () => {
        if (onSubmit && content.length > 0) onSubmit(content);
        setContent('')  
    }

    const handleChange = (event : ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value)
    }

    const handleKeyDown = (event : React.KeyboardEvent<HTMLTextAreaElement>) => {                
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit()
        }
    }

    //TODO: manage size of the text area.
    return (
        <StyledContainer 
            display={"flex"}
            flexDirection={"row"}
            height={"auto"}
            alignItems={"center"} 
        >
            <StyledTextArea 
                value={content} 
                placeholder={t('chat.input-placeholder')} 
                onKeyDown={handleKeyDown}
                onChange={handleChange}
            />
            <StyledContainer 
                width={"auto"}
                margin={"0px 10px 0px 10px"}
                height={"auto"}
            >
                <SendIcon onClick={handleSubmit} />
            </StyledContainer>
        </StyledContainer>
    )
}

export default MessageInput
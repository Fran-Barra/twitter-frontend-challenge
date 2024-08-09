import LogoutPrompt from "../navbar/logout-prompt/LogoutPrompt";
import {
    StyledLogoutPrompt,
    StyledProfileLogoutPromptContainer
} from "./StyledProfileLogoutPromptContainer";
import React, {useEffect, useState} from "react";
import icon from "../../assets/icon.jpg";
import {StyledP} from "../common/text";
import {StyledContainer} from "../common/Container";
import useReactQueryProxy from "../../service/reactQueryRequestProxy";
import HideOnClickOutside from "../common/HideOnClickOutside";


interface ProfileLogoutPromptProps {
    margin: string
    direction: string
}

const ProfileLogoutPrompt = ({margin, direction}: ProfileLogoutPromptProps) => {
    const [logoutOpen, setLogoutOpen] = useState(false);
    const service = useReactQueryProxy()


  //TODO: manage error and is loading
  const {data: user, isLoading, error} = service.useMe()


    const handleLogout = () => {
        setLogoutOpen(!logoutOpen);
    };

    const handleButtonClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };


    return (
        <StyledContainer
            maxHeight={"48px"}
            flexDirection={"row"}
            className={'profile-info'}
            alignItems={'center'}
            gap={'8px'}
            onClick={handleLogout}
            cursor={'pointer'}
        >
            <StyledProfileLogoutPromptContainer direction={direction}>
                <img src={user?.profilePicture ?? icon} className="icon" alt="Icon" onError={(e)=>e.currentTarget.src = icon}/>
                <HideOnClickOutside 
                    Wrapper={StyledLogoutPrompt} 
                    wrapperProps={{margin: margin, onClick: (event: React.MouseEvent<Element, MouseEvent>) => handleButtonClick(event)}}
                    isOpen={logoutOpen} 
                    onClose={handleLogout}
                >
                    <LogoutPrompt show={logoutOpen}/>
                </HideOnClickOutside>
            </StyledProfileLogoutPromptContainer>
            <StyledContainer padding={"4px 0"} gap={"4px"} className={'user-info'}>
                <StyledP primary>{user?.name}</StyledP>
                <StyledP primary={false}>{`@${user?.username}`}</StyledP>
            </StyledContainer>
        </StyledContainer>
    )
}

export default ProfileLogoutPrompt
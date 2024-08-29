import React from "react";
import TabBar from "./tab-bar/TabBar";
import logo from "../../../../assets/logo.png";
import {StyledHeaderContainer} from "./HeaderContainer";
import ProfileLogoutPrompt from "../../../../components/profile-logout/ProfileLogoutPrompt";

interface HeaderProps {
  onFollowingFeed: ()=>void;
  onForYouFeed: ()=>void;
}

const Header = ({ onFollowingFeed, onForYouFeed} : HeaderProps) => {

  return (
      <>
        <StyledHeaderContainer>
          <ProfileLogoutPrompt margin={'58px 16px'} direction={'column'}/>
          <div className="title-container">
            <img src={logo} className="logo" alt="Logo"/>
          </div>
          <TabBar onFollowingFeed={onFollowingFeed} onForYouFeed={onForYouFeed}/>
        </StyledHeaderContainer>
      </>
  );
};

export default Header;

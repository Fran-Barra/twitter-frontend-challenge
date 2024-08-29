import React, { useState } from "react";
import Tab from "./tab/Tab";
import { useTranslation } from "react-i18next";
import { StyledTabBarContainer } from "./TabBarContainer";

interface TabBarProps {
  onFollowingFeed: ()=>void;
  onForYouFeed: ()=>void;
}

const TabBar = ({ onFollowingFeed, onForYouFeed} : TabBarProps) => {
  const [activeFirstPage, setActiveFirstPage] = useState(true);
  const { t } = useTranslation();

  const handleTabClick = (following : boolean) => {
    following ? onFollowingFeed() : onForYouFeed()
    setActiveFirstPage(!following)
  }

  return (
    <>
      <StyledTabBarContainer>
        <Tab
          active={activeFirstPage}
          text={t("header.for-you")}
          onClick={()=>handleTabClick(false)}
        />
        <Tab
          active={!activeFirstPage}
          text={t("header.following")}
          onClick={()=>handleTabClick(true)}
        />
      </StyledTabBarContainer>
    </>
  );
};

export default TabBar;

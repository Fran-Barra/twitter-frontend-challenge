import React, { useState } from "react";
import { StyledContentContainer } from "./StyledContentContainer";
import Header from "../header/Header";
import TweetBox from "../../../../components/tweet-box/TweetBox";
import { StyledFeedContainer } from "./FeedContainer";
import ContentFeed from "../../../../components/feed/ContentFeed";
import { StyledContainer } from "../../../../components/common/Container";



const ContentContainer = () => {
  const [followingFeed, setFollowingFeed] = useState<boolean>(false)
  return (
    <StyledContentContainer>
      <Header onForYouFeed={()=>setFollowingFeed(false)} onFollowingFeed={()=>setFollowingFeed(true)}/>
      <StyledFeedContainer>
        <StyledContainer
          width={"100%"}
          padding={"16px"}
          borderBottom={"1px solid #ebeef0"}
        >
          <TweetBox />
        </StyledContainer>
        <StyledContainer minHeight={"66vh"} maxHeight={"100%"} width={"100%"}>
          <ContentFeed following={followingFeed}/>
        </StyledContainer>
      </StyledFeedContainer>
    </StyledContentContainer>
  );
};

export default ContentContainer;

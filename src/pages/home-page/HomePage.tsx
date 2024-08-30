import React from "react";
import SuggestionBox from "./components/suggestionBox/SuggestionBox";
import ContentContainer from "./components/contentContainer/ContentContainer";
import { SearchBar } from "../../components/search-bar/SearchBar";
import { StyledUserSuggestionContainer } from "./UserSeuggestionContainer";
import { StyledContainer } from "../../components/common/Container";

const HomePage = () => {
  return (
    <StyledContainer height={"100%"} maxHeight={"100%"} flexDirection={"row"}>
      <ContentContainer />
      <StyledUserSuggestionContainer>
        <SearchBar />
        <SuggestionBox />
      </StyledUserSuggestionContainer>
    </StyledContainer>
  );
};

export default HomePage;

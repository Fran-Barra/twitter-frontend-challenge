import React, { useEffect, useState } from "react";
import SuggestionBox from "./components/suggestionBox/SuggestionBox";
import ContentContainer from "./components/contentContainer/ContentContainer";
import { updateFeed } from "../../redux/user";
import { useHttpRequestService } from "../../service/HttpRequestService";
import { SearchBar } from "../../components/search-bar/SearchBar";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { StyledUserSuggestionContainer } from "./UserSeuggestionContainer";
import { StyledContainer } from "../../components/common/Container";

const HomePage = () => {
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  // const service = useHttpRequestService();

  // const handleSetUser = async () => {
  //   try {
  //     const data = await service.getPosts(query);
  //     dispatch(updateFeed(data));
  //   } catch (e) {
  //     navigate("/sign-in");
  //   }
  // };

  // useEffect(() => {
  //   handleSetUser().then();
  // }, []);

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

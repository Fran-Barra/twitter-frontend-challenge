import React from "react";
import Avatar from "../common/avatar/Avatar";
import icon from "../../assets/icon.jpg";
import { useNavigate } from "react-router-dom";
import { StyledUserContainer } from "./StyledUserContainer";
import { StyledUserContainerP } from "./StyledUserContainerP";

interface UserDataBoxProps {
  name?: string;
  username?: string;
  profilePicture?: string;
  id: string;
  onClick?: () => void;
}
export const UserDataBox = ({
  name,
  username,
  profilePicture,
  id,
  onClick,
}: UserDataBoxProps) => {
  const navigate = useNavigate();

  console.log("user data is visible");
  

  return (
    <StyledUserContainer onClick={onClick}>
      <Avatar
        width={"48px"}
        height={"48px"}
        src={profilePicture ?? icon}
        onClick={() => onClick ?? navigate(`/profile/${id}`)}
        alt={name ?? "Name"}
      />
      <StyledUserContainer>
        <StyledUserContainerP>{name ?? "Name"}</StyledUserContainerP>
        <StyledUserContainerP style={{ color: "#566370" }}>{"@" + username ?? "@Username"}</StyledUserContainerP>
      </StyledUserContainer>
    </StyledUserContainer>
  );
};

export default UserDataBox;

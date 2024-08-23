import React, {useEffect, useState} from "react";
import Button from "../button/Button";
import UserDataBox from "../user-data-box/UserDataBox";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../button/StyledButton";
import useReactQueryProxy from "../../service/reactQueryRequestProxy";
import { StyledFollowUserBox } from "./StyledFollowUserBox";

interface FollowUserBoxProps {
  profilePicture?: string;
  name?: string;
  username?: string;
  id: string;
  follows: boolean;
}

const FollowUserBox = ({
                         profilePicture,
                         name,
                         username,
                         id,
                         follows
                       }: FollowUserBoxProps) => {
  const {t} = useTranslation();
  const service = useReactQueryProxy()

  const [isFollowing, setIsFollowing] = useState(false);

  const followMutation = service.useFollowUser({
    data: {userId: id},
    onSuccess: ()=>{
      console.log("follow success");     
      setIsFollowing(true)
    },
    onError: (error)=>{
      //TODO: manage error
      console.error(error);
    }
  })
  
  const unfollowMutation = service.useUnfollowUser({
    data: {userId: id},
    onSuccess: ()=>{
      console.log("unfollow success");
      
      setIsFollowing(false)
    },
    onError: (error) => {
      //TODO: manage error
      console.error(error);
    }
  })

  const handleFollow = () => {
    if (isFollowing) {
        unfollowMutation.mutate();
    } else {
        followMutation.mutate();
    }
  };  

  return (
      <StyledFollowUserBox>
        <UserDataBox
            id={id}
            name={name!}
            profilePicture={profilePicture!}
            username={username!}
        />
        <Button
            text={isFollowing ? t("buttons.unfollow") : t("buttons.follow")}
            buttonType={isFollowing ? ButtonType.DELETE : ButtonType.FOLLOW}
            size={"SMALL"}
            onClick={handleFollow}
        />
      </StyledFollowUserBox>
  );
};

export default FollowUserBox;

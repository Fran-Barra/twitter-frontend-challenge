import React, {useContext, useState} from "react";
import Button from "../button/Button";
import UserDataBox from "../user-data-box/UserDataBox";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../button/StyledButton";
import useReactQueryProxy from "../../service/reactQueryRequestProxy";
import { StyledFollowUserBox } from "./StyledFollowUserBox";
import ToastContext from "../toast/ToastContext";
import { ToastType } from "../toast/Toast";

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
  const {createToast} = useContext(ToastContext)
  const {t} = useTranslation();
  const service = useReactQueryProxy()

  const [isFollowing, setIsFollowing] = useState(false);

  const followMutation = service.useFollowUser({
    data: {userId: id},
    onSuccess: ()=>setIsFollowing(true),
    onError: (error)=>{
      console.error(error);
      createToast(t(`toast.follow.failed-follow`), ToastType.ALERT)
    }
  })
  
  const unfollowMutation = service.useUnfollowUser({
    data: {userId: id},
    onSuccess: ()=>setIsFollowing(false),
    onError: (error) => {
      console.error(error);
      createToast(t(`toast.follow.failed-follow`), ToastType.ALERT)
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

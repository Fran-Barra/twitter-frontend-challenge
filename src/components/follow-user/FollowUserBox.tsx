import React, {useEffect, useState} from "react";
import Button from "../button/Button";
import UserDataBox from "../user-data-box/UserDataBox";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../button/StyledButton";
import "./FollowUserBox.css";
import {Author, User} from "../../service";
import useReactQueryProxy from "../../service/reactQueryRequestProxy";

interface FollowUserBoxProps {
  profilePicture?: string;
  name?: string;
  username?: string;
  id: string;
}

const FollowUserBox = ({
                         profilePicture,
                         name,
                         username,
                         id,
                       }: FollowUserBoxProps) => {
  const {t} = useTranslation();
  const service = useReactQueryProxy()


  //TODO: handle loading and error
  const {data: user, isLoading, error} = service.useMe()
  useEffect(() => {
      if (!user) {
        console.log("failed to get me");
        return
      }
      setIsFollowing(user?.following.some((f: Author) => f.id === id))
  }, [user]);


  const [isFollowing, setIsFollowing] = useState(false);

  const followMutation = service.useFollowUser({
    data: {userId: id},
    onSuccess: ()=>setIsFollowing(true),
    onError: (error)=>{
      //TODO: manage error
      console.error(error);
    }
  })
  
  const unfollowMutation = service.useUnfollowUser({
    data: {userId: id},
    onSuccess: ()=>setIsFollowing(false),
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
      <div className="box-container">
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
      </div>
  );
};

export default FollowUserBox;

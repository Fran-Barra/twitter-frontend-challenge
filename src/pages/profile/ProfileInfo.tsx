import React, { ChangeEvent, useRef, useContext } from "react";
import { StyledContainer } from "../../components/common/Container";
import Avatar from "../../components/common/avatar/Avatar";
import Icon from "../../assets/icon.jpg";
import { StyledH5, StyledP } from "../../components/common/text";
import ToastContext from "../../components/toast/ToastContext";
import { ToastType } from "../../components/toast/Toast";
import { t } from "i18next";
import useReactQueryProxy from "../../service/reactQueryRequestProxy";


interface ProfileInfoContainerProps {
  name?: string;
  username: string;
  profilePicture?: string;
  isMe: boolean
}
const ProfileInfo = ({
  name,
  username,
  profilePicture,
  isMe
}: ProfileInfoContainerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const service = useReactQueryProxy()
  const {createToast} = useContext(ToastContext)
  const mutateProfilePicture = service.usePostProfilePicture({
    onSuccess: ()=>createToast(t('user.post-profile-picture'), ToastType.INFO),
    onError: ()=>createToast(t('error.profile.new-picture'), ToastType.ALERT)
  })

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {    
    const files = event.target.files;
    if (files) {
      const newImage = Array.from(files!)[0];
      mutateProfilePicture.mutate(newImage)
    }
  };

  const handleAvatarClick = () => { 
    if (!isMe) return   
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <StyledContainer gap={"32px"} flex={2} flexDirection={"row"}>
      <Avatar
        src={profilePicture === null ? Icon : profilePicture!}
        width={"133px"}
        height={"133px"}
        alt={name ?? "Name"}
        onClick={handleAvatarClick}
      />
      <input
        type="file"
        id={`image-upload-profile-pic`}
        accept="image/*"
        multiple={false}
        onChange={handleImageUpload}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
      <StyledContainer justifyContent={"center"}>
        <StyledH5>{name ?? "Name"}</StyledH5>
        <StyledP primary={false}>{`@${username}`}</StyledP>
        <StyledP primary={false}>Description...</StyledP>
      </StyledContainer>
    </StyledContainer>
  );
};
export default ProfileInfo;



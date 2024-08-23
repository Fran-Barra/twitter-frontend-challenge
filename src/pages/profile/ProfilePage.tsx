import React, {useEffect, useState} from "react";
import ProfileInfo from "./ProfileInfo";
import {useNavigate, useParams} from "react-router-dom";
import Modal from "../../components/modal/Modal";
import {useTranslation} from "react-i18next";
import {User} from "../../service";
import {ButtonType} from "../../components/button/StyledButton";
import {useHttpRequestService} from "../../service/HttpRequestService";
import Button from "../../components/button/Button";
import ProfileFeed from "../../components/feed/ProfileFeed";
import {StyledContainer} from "../../components/common/Container";
import {StyledH5} from "../../components/common/text";
import useReactQueryProxy from "../../service/reactQueryRequestProxy";
import { createPortal } from "react-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalValues, setModalValues] = useState({
    text: "",
    title: "",
    type: ButtonType.DEFAULT,
    buttonText: "",
  });
  const service = useHttpRequestService()
  const reactQueryService = useReactQueryProxy()
    
  const id = useParams().id;
  const navigate = useNavigate();

  const {t} = useTranslation();

  //TODO: manage error
  const {data: user, isLoading, error} = reactQueryService.useMe()


  const getProfileData = async () => {
    service
        .getProfile(id || '')
        .then((res) => {
          setProfile(res);
        })
        .catch((e) => {
          service
              .getProfileView(id)
              .then((res) => {
                setProfile(res);                
              })
              .catch((error2) => {
                console.log(error2);
              });
        });
  };

  const handleButtonType = (): { component: ButtonType; text: string } => {
    if (!profile) return {component: ButtonType.DISABLED, text: t("buttons.follow")}
    if (profile.id === user?.id)
      return {component: ButtonType.DELETE, text: t("buttons.delete")};
    if (profile.follows)
      return {component: ButtonType.OUTLINED, text: t("buttons.unfollow")};
    else return {component: ButtonType.FOLLOW, text: t("buttons.follow")};
  };



  const handleSubmit = () => {
    if (profile?.id === user?.id) {
      service.deleteProfile().then(() => {
        localStorage.removeItem("token");
        navigate("/sign-in");
      });
    } else {
      unfollowMutation.mutate()
    }
  };

  useEffect(() => {
    getProfileData().then();
  }, [id]);

  //TODO: ask if there is a better way to do this
  const unfollowMutation = reactQueryService.useUnfollowUser({
    data: {userId: id || ''},
    onSuccess: () => {
      setShowModal(false);
      getProfileData()
    }
  })

  const followMutation = reactQueryService.useFollowUser({
    data: {userId: id || ''},
    onSuccess: () => {
      service.getProfile(id || '').then((res) => setProfile(res));
    }
  })

  //TODO: this is strange, ask why null
  if (!id || !user) return null;

  const handleButtonAction = async () => {
    if (profile?.id === user?.id) {
      setShowModal(true);
      setModalValues({
        title: t("modal-title.delete-account"),
        text: t("modal-content.delete-account"),
        type: ButtonType.DELETE,
        buttonText: t("buttons.delete"),
      });
    } else {
      if (profile?.follows || false) {
        setShowModal(true);
        setModalValues({
          text: t("modal-content.unfollow"),
          title: `${t("modal-title.unfollow")} @${profile?.username}?`,
          type: ButtonType.FOLLOW,
          buttonText: t("buttons.unfollow"),
        });
      } else {
        followMutation.mutate()
      }
      return await getProfileData();
    }
  };
  

  return (
      <>
        <StyledContainer
            maxHeight={"100vh"}
            borderRight={"1px solid #ebeef0"}
            maxWidth={'600px'}
        >
          {profile && (
              <>
                <StyledContainer
                    borderBottom={"1px solid #ebeef0"}
                    maxHeight={"212px"}
                    padding={"16px"}
                >
                  <StyledContainer
                      alignItems={"center"}
                      padding={"24px 0 0 0"}
                      flexDirection={"row"}
                  >
                    <ProfileInfo
                        name={profile!.name!}
                        username={profile!.username}
                        profilePicture={profile!.profilePicture}
                    />
                    <Button
                        buttonType={handleButtonType().component}
                        size={"100px"}
                        onClick={handleButtonAction}
                        text={handleButtonType().text}
                    />
                  </StyledContainer>
                </StyledContainer>
                <StyledContainer width={"100%"}>
                  {!profile.private || profile.follows || profile.id === user.id ? (
                      <ProfileFeed/>
                  ) : (
                      <StyledH5>Private account</StyledH5>
                  )}
                </StyledContainer>
                { showModal &&
                  createPortal(
                  <Modal
                      show={showModal}
                      text={modalValues.text}
                      title={modalValues.title}
                      acceptButton={
                        <Button
                            buttonType={modalValues.type}
                            text={modalValues.buttonText}
                            size={"MEDIUM"}
                            onClick={handleSubmit}
                        />
                      }
                      onClose={() => {
                        setShowModal(false);
                      }}
                  />,
                  document.body
                )}
              </>
          )}
        </StyledContainer>
      </>
  );
};

export default ProfilePage;

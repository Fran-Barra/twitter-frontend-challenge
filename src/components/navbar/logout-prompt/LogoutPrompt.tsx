import React, {useEffect, useState} from "react";
import Modal from "../../modal/Modal";
import logo from "../../../assets/logo.png";
import Button from "../../button/Button";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import SwitchButton from "../../switch/SwitchButton";
import {ButtonType} from "../../button/StyledButton";
import {StyledPromptContainer} from "./PromptContainer";
import {StyledContainer} from "../../common/Container";
import {StyledP} from "../../common/text";
import useReactQueryProxy from "../../../service/reactQueryRequestProxy";
import { createPortal } from "react-dom";

interface LogoutPromptProps {
  show: boolean;
}

const LogoutPrompt = ({ show }: LogoutPromptProps) => {
  const [showPrompt, setShowPrompt] = useState<boolean>(show);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const service = useReactQueryProxy();

  //TODO: manage error and loading
  const {data: user} = service.useMe()

  const handleClick = () => {
    setShowModal(true);
  };


  const handleLanguageChange = () => {
    if (i18n.language === "es") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("es");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  useEffect(() => {
    setShowPrompt(show);
  }, [show]);


  //TODO: warning: You provided a `checked` prop to a form field without an `onChange` handler. 
  //This will render a read-only field. If the field should be mutable use `defaultChecked`. 
  //Otherwise, set either `onChange` or `readOnly`.
  return (
    <>
      {showPrompt && (
        <StyledPromptContainer>
          <StyledContainer
            flexDirection={"row"}
            gap={"16px"}
            borderBottom={"1px solid #ebeef0"}
            padding={"16px"}
            alignItems={"center"}
          >
            <StyledP primary>Es:</StyledP>
            <SwitchButton
              checked={i18n.language === "es"}
              onChange={handleLanguageChange}
            />
          </StyledContainer>
          <StyledContainer onClick={handleClick} alignItems={"center"}>
            <StyledP primary>{`${t("buttons.logout")} @${
              user?.username
            }`}</StyledP>
          </StyledContainer>
        </StyledPromptContainer>
      )}
      {
        showModal && createPortal(
          <Modal
            show={showModal}
            text={t("modal-content.logout")}
            img={logo}
            title={t("modal-title.logout")}
            acceptButton={
              <Button
                buttonType={ButtonType.FOLLOW}
                text={t("buttons.logout")}
                size={"MEDIUM"}
                onClick={handleLogout}
              />
            }
            onClose={() => setShowModal(false)}
          />,
          document.body
        )
      }
      </>
  );
};

export default LogoutPrompt;

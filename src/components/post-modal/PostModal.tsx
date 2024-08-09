import React, { ReactNode } from "react";
import { StyledBlurredBackground } from "../common/BlurredBackground";
import { ModalCloseButton } from "../common/ModalCloseButton";
import { StyledTweetModalContainer } from "../tweet-modal/TweetModalContainer";
import HideOnClickOutside from "../common/HideOnClickOutside";

interface PostModalProps {
  onClose: () => void;
  show: boolean;
  children: ReactNode;
}

export const PostModal = ({ onClose, show, children }: PostModalProps) => {
  return (
    <>
      {show && (
        <StyledBlurredBackground>
          <HideOnClickOutside
            Wrapper={StyledTweetModalContainer}
            isOpen={show}
            onClose={onClose}
          >
            <ModalCloseButton onClick={onClose} />
            {children}
          </HideOnClickOutside>
        </StyledBlurredBackground>
      )}
    </>
  );
};

import React, { ReactNode, useRef } from "react";
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
  const modalRef = useRef<HTMLDivElement>(null)
  return (
    <>
      {show && (
        <StyledBlurredBackground>
          <HideOnClickOutside
            modalRef={modalRef}
            isOpen={show}
            onClose={onClose}
          >
            <StyledTweetModalContainer ref={modalRef}>
              <ModalCloseButton onClick={onClose} />
              {children}
            </StyledTweetModalContainer>
          </HideOnClickOutside>
        </StyledBlurredBackground>
      )}
    </>
  );
};

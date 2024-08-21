import React, { useState } from "react";
import { StyledToastContainer } from "./ToastContainer";
import { AlertIcon } from "../icon/Icon";

export enum ToastType {
  ALERT = "ALERT",
  INFO = "INFO",
}

interface ToastProps {
  message: string;
  type: ToastType;
  show?: boolean;
  onClose?: ()=>void;
}

const Toast = ({ message, type, show, onClose}: ToastProps) => {
  const [isShown, setIsShown] = useState<boolean>(show ?? true);

  //TODO: ask how is the correct way to use the colors
  const iconMap = {
    [ToastType.ALERT]: <AlertIcon />,
    [ToastType.INFO]: <AlertIcon color="#000000"/>
  };

  const toastIcon = iconMap[type] || null;

  const handleClick = () => {
    setIsShown(false)
    if (onClose) onClose()
  } 
  
  return (
    <>
      {isShown && (
        <StyledToastContainer type={type} onClick={handleClick}>
          {toastIcon}
          <p>{message}</p>
        </StyledToastContainer>
      )}
    </>
  );
};

export default Toast;

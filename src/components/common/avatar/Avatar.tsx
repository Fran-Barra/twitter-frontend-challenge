import React from "react";
import { StyledAvatarContainer } from "./AvatarContainer";
import NameImage from "./NameImage";
import icon from '../../../assets/icon.jpg'


interface AvatarProps {
  src: string;
  alt: string;
  onClick?: () => void;
  width?: string;
  height?: string;
}

const Avatar = ({ src, alt, onClick, width, height }: AvatarProps) => {
  return (
    <StyledAvatarContainer onClick={onClick} width={width} height={height}>
      {src !== null ? <img src={src} alt={alt} onError={(e)=>e.currentTarget.src = icon}/> : <NameImage name={alt} />}
    </StyledAvatarContainer>
  );
};
export default Avatar;

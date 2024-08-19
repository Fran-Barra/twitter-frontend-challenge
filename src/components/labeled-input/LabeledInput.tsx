import React, { useRef, useState } from "react";
import { StyledInputContainer } from "./InputContainer";
import { StyledInputTitle } from "./InputTitle";
import { StyledInputElement } from "./StyledInputElement";
import { useField } from "formik";
import { StyledP } from "../common/text";

interface InputWithLabelProps {
  name: string
  type?: "password" | "text";
  title: string;
  placeholder: string;
  required: boolean;
}

const LabeledInput = ({
  name,
  title,
  placeholder,
  required,
  type = "text",
}: InputWithLabelProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focus, setFocus] = useState(false);

  const [field, meta] = useField(name)

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <StyledInputContainer
        className={`${meta.error ? "error" : ""}`}
        onClick={handleClick}
      >
        <StyledInputTitle
          className={`${focus ? "active-label" : ""} ${meta.error ? "error" : ""}`}
        >
          {title}
        </StyledInputTitle>
        <StyledInputElement
          {...field}
          type={type}
          required={required}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={meta.error ? "error" : ""}
          ref={inputRef}
        />
      </StyledInputContainer>
      {
        meta.error ? <StyledP className={"error-message"} primary={false}>{meta.error}</StyledP> : null
      }
    </>
  );
};

export default LabeledInput;

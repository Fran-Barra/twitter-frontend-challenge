import styled from "styled-components";

export const StyledModalInputContainer = styled.div`
  border-radius: 8px;
  padding: 8px;
  border: 1px solid ${(props) => props.theme.colors.outline};
  transition: 0.3s;
  width: 200px;
  height: auto;

  &.active-div {
    border: 1px solid ${(props) => props.theme.colors.main};
  }

  &.error {
    border: 1px solid ${(props) => props.theme.colors.error};
  }
`;
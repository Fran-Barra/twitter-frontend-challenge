import styled from "styled-components";

export const StyledToastListDisplay = styled.ul`
    position: fixed;
    width: auto;

    top: 0px;
    left: 0px;
    padding-top: 10px;
    padding-left: 10px;
    
    z-index: 1000;
    pointer-events: none;

    list-style-type: none;
    margin: 0;

    display: flex;
    flex-direction: column;
    gap: 10px;
`;
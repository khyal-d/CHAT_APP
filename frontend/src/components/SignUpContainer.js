import styled from "styled-components";

export const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${(props) =>
    props.signed !== true
      ? `
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
`
      : null}
`;

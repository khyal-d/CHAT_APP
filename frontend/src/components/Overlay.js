import styled from "styled-components";

export const Overlay = styled.div`
  background: #004d4d;
  background: -webkit-linear-gradient(to right, #142c4f, #142c4f);
  background: linear-gradient(to right,  #01655f,  #00403c);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${(props) => (props.signed !== true ? `transform: translateX(50%);` : null)}
`;

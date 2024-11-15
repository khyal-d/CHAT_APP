import styled from "styled-components";
import { OverlayPanel } from "./OverlayPanel";

export const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${(props) => (props.signed !== true ? `transform: translateX(0);` : null)}
`;

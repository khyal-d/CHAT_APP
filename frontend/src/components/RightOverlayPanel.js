import styled from "styled-components";
import { OverlayPanel } from "./OverlayPanel";

export const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${(props) => (props.signed !== true ? `transform: translateX(20%);` : null)}
`;

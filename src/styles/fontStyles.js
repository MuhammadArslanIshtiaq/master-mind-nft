import { createGlobalStyle } from "styled-components";
import acme from "./fonts/acme.ttf";
const FontStyles = createGlobalStyle`

@font-face {
  font-family: 'acme';
  src: url(${acme}) format('openType');
  font-weight: 300;
  font-style: normal;
}
`;

export default FontStyles;

// import original module declarations
import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    tableBg: string;
    text: {
      title: string;
      body: string;
    };
    cell: {
      bg: string;
      accentBg: string;
      primaryHighlightBg: string;
      secondaryHighlightBg: string;
    };
  }
}
// 취소선, 등록날짜 및 시간 등의 세부적인 theme은 진행하면 update

import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      bgColor: string;
      textColor: string;
      accentColor: string;
      listColor: string;
      cardColor: string;
      iconColor: string;
      shadowColor: string;
      placeholderColor: string;
      borderColor: string;
      dragColor: string;
    };
  }
}

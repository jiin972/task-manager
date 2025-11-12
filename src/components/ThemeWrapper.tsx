import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
import { darkMode, lightMode } from "../theme";
import { ThemeProvider } from "styled-components";

interface ThemeWrapperProps {
  children: React.ReactNode;
}

function ThemeWrapper({ children }: ThemeWrapperProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const theme = isDark ? darkMode : lightMode;

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default ThemeWrapper;

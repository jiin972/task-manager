import { motion, type Variants } from "framer-motion";
import styled from "styled-components";

export const Wrapper = styled.div<{ $isDragging: boolean }>`
  height: 6vh;
  padding: 30px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 25px;
  pointer-events: ${(props) => (props.$isDragging ? "none" : "auto")};
`;
export const Title = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 700;
`;
export const BtnContainer = styled.div`
  display: flex;
  align-items: center;
  & > *:first-child {
    margin-right: 50px;
  }
`;

export const InputToAddBoard = styled(motion.input)`
  border-width: 0 0 2px;
  border-color: ${(props) => props.theme.colors.borderColor};
  outline: none;
  background: transparent;
  box-sizing: border-box;
  padding: 5px;
  &::placeholder {
    color: ${(props) => props.theme.colors.placeholderColor};
    font-size: 17px;
    text-align: left;
  }
  &:focus {
    color: ${(props) => props.theme.colors.placeholderColor};
    font-size: 17px;
    text-align: left;
  }
`;

export const AddBoardBtn = styled(motion.button)`
  font-size: 1rem;
  border: none;
  background: none;
  color: ${(props) => props.theme.colors.iconColor};
  cursor: pointer;
`;
export const ThemeToggleBtn = styled(motion.button)`
  border: none;
  background: none;
  color: ${(props) => props.theme.colors.iconColor};
  cursor: pointer;
  :hover {
    color: ${(props) => props.theme.colors.accentColor};
  }
`;

//variants
export const inputVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1], // 부드러운 cubic-bezier
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export const toggleBtnVarianst: Variants = {
  hover: {
    scale: 1.2,
    rotate: 30,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};
export const addBtnVarianst: Variants = {
  hover: {
    scale: 1.2,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

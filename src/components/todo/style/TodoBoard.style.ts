import { motion, type Variants } from "framer-motion";
import styled, { css } from "styled-components";

interface ITodoContainerProps {
  $isOver: boolean;
  $isDragging: boolean;
  $listIsOver: boolean;
}

export const TodoContainer = styled.div<ITodoContainerProps>`
  width: 300px;
  min-width: 300px;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  background-color: ${(props) => props.theme.colors.cardColor};
  border-radius: 10px;
  box-shadow: ${(props) => props.theme.colors.shadowColor} 6px 12px 12px;
  ${(props) =>
    props.$isDragging &&
    css`
      z-index: 10;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
      outline: 3px solid ${(props) => props.theme.colors.dragColor};
      opacity: 0.8;
    `}
`;

export const TodoHeader = styled(motion.div)`
  padding: 20px 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

export const TodoBoardTitle = styled.div`
  font-size: 25px;
  font-weight: 700;
`;

export const TodoItems = styled(motion.ul)<{ $listIsOver: boolean }>`
  width: 100%;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  flex-grow: 1;
  overflow-y: auto;
  ${(props) =>
    props.$listIsOver &&
    css`
      outline: 2px dashed ${props.theme.colors.dragColor};
      background: rgba(255, 255, 255, 0.05);
    `}
`;

export const ButtonContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const BtnToModify = styled(motion.button)`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.iconColor};
  cursor: pointer;
`;
export const BtnToDelete = styled(motion.button)`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.iconColor};
  cursor: pointer;
`;
export const BtnToDrag = styled(motion.button)`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.iconColor};
  cursor: pointer;
`;

export const TodoForm = styled.form`
  width: 100%;
  min-height: 50px;
  background-color: ${(props) => props.theme.colors.listColor};
  border-radius: 0px 0px 10px 10px;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TodoInput = styled.input`
  background: none;
  border: none;
  height: 100%;
  width: 80%;
  padding: 10px 5px;
  outline: none;
  border-bottom: 2px solid transparent;
  &::placeholder {
    color: ${(props) => props.theme.colors.placeholderColor};
    font-size: 20px;
    text-align: center;
  }
  &:focus {
    font-size: 20px;
    color: ${(props) => props.theme.colors.textColor};
    border-bottom-color: ${(props) => props.theme.colors.borderColor};
  }
`;
//variants

export const btnContainerVariants: Variants = {
  normal: { opacity: 1 },
  hover: {
    transition: {},
  },
};

export const btnVarianst: Variants = {
  normal: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "tween",
    },
  },
};

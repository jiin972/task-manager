//styled-components
import { motion, type Variants } from "framer-motion";
import styled, { css } from "styled-components";

interface ITodoItemProps {
  $isOverlay?: boolean;
  $isDragging?: boolean;
}

export const TodoForm = styled(motion.form)`
  width: 100%;
  min-height: 50px;
  background-color: ${(props) => props.theme.colors.listColor};
  border-radius: 0px 0px 10px 10px;
  padding: 10px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const TodoListUpdateInput = styled.input`
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  outline: none;
  box-sizing: border-box;
  height: 100%;
  width: 100%;

  &:focus {
    font-size: 15px;
    color: ${(props) => props.theme.colors.textColor};
    border-bottom-color: ${(props) => props.theme.colors.borderColor};
  }
`;

export const TodoItem = styled(motion.ul)<ITodoItemProps>`
  padding: 20px 10px;
  width: 100%;
  height: auto;
  min-height: 2.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  border-radius: 0.5rem;
  font-size: 1rem;
  flex-shrink: 0;
  background-color: ${(props) => props.theme.colors.listColor};
  ${(props) =>
    props.$isOverlay &&
    css`
      width: 280px;
      z-index: 10;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
      border: 1px solid ${(props) => props.theme.colors.dragColor};
      opacity: 0.8;
      cursor: grabbing;
    `};
  ${(props) =>
    props.$isDragging &&
    css`
      /* 드래그 중일 때 원본 요소는 투명하게 유지하되 공간은 유지해야 합니다. */
      /* dnd-kit은 드래그된 항목의 시각적 표현을 오버레이를 통해 처리합니다. */
      /* 이 스타일은 dnd-kit의 전환이 올바르게 작동하도록 불필요한 레이아웃 변경을 제거합니다. */
      opacity: 0; /* 원본 항목을 보이지 않게 만듭니다. */
      pointer-events: none; /* 보이지 않는 원본 항목과의 상호 작용을 방지합니다. */
    `}
`;

export const TodoText = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  height: 100%;
  cursor: text;
`;

export const ButtonContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const BtnToUpdate = styled(motion.button)`
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

//Variants

export const cardVariants: Variants = {
  normal: { scale: 1 },
  hover: { scale: 1, transition: { type: "tween", duration: 0.05 } },
};

export const iconVariants: Variants = {
  normal: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3, type: "tween" } },
};

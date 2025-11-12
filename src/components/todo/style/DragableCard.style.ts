//styled-components

import { motion, type Variants } from "framer-motion";
import styled from "styled-components";

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

export const TodoItem = styled(motion.li)`
  padding: 20px 10px;
  width: 100%;
  height: 100%;
  min-height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: ${(props) => props.theme.colors.listColor};
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

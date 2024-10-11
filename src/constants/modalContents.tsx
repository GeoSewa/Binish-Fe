import { ReactElement } from "react";
import LoginModal from "@Components/Home/LoginModal";

export type ModalContentsType = "login" | null;
export type PromptDialogContentsType = "delete-layer" | null;

type ModalReturnType = {
  title: string;
  content: ReactElement;
  className?: string;
  hideCloseButton?: boolean;
};

export function getModalContent(content: ModalContentsType): ModalReturnType {
  switch (content) {
    case "login":
      return {
        title: "",
        content: <LoginModal />,
        className: "naxatw-w-[30rem]",
      };
    default:
      return {
        title: "",
        content: <></>,
      };
  }
}

export function getPromptDialogContent(
  content: PromptDialogContentsType
): ModalReturnType {
  switch (content) {
    case "delete-layer":
      return {
        title: "",
        content: <></>,
      };
    default:
      return {
        title: "",
        content: <></>,
      };
  }
}

import { createSlice } from "@reduxjs/toolkit";
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import {
  ModalContentsType,
  PromptDialogContentsType,
} from "@Constants/modalContents";
import persist from "@Store/persist";

export interface CommonState {
  showModal: boolean;
  modalContent: ModalContentsType;
  showPromptDialog: boolean;
  promptDialogContent: PromptDialogContentsType;
  navbarToggled: boolean;
  activeExamTab: string;
  examView: 'main' | 'email-verification' | 'mock-tests' | 'mcq-test';
  userEmail: string | null;
  selectedMockTest: number | null;
  attemptId: string | null; // <-- Added for storing attempt id
  examDurationMinutes: number | null; // duration for current mock test
  isAuthenticated: boolean;
  username: string | null;
}

const initialState: CommonState = {
  showModal: false,
  modalContent: null,
  showPromptDialog: false,
  promptDialogContent: null,
  navbarToggled: false,
  activeExamTab: "form-section",
  examView: 'main',
  userEmail: null,
  selectedMockTest: null,
  attemptId: null, // <-- Added for storing attempt id
  examDurationMinutes: null,
  isAuthenticated: false,
  username: null,
};

const setCommonState: CaseReducer<
  CommonState,
  PayloadAction<Partial<CommonState>>
> = (state, action) => ({
  ...state,
  ...action.payload,
});

const toggleModal: CaseReducer<
  CommonState,
  PayloadAction<ModalContentsType | undefined>
> = (state, action) => ({
  ...state,
  showModal: !!action.payload,
  modalContent: action.payload || state.modalContent,
});

const setToggleNavbar: CaseReducer<CommonState, PayloadAction<boolean>> = (
  state,
  action
) => ({
  ...state,
  navbarToggled: action.payload,
});

const setModalContent: CaseReducer<
  CommonState,
  PayloadAction<ModalContentsType>
> = (state, action) => ({
  ...state,
  modalContent: action.payload || null,
});

const togglePromptDialog: CaseReducer<
  CommonState,
  PayloadAction<PromptDialogContentsType | undefined>
> = (state, action) => ({
  ...state,
  showPromptDialog: !!action.payload || !state.showPromptDialog,
  promptDialogContent: action.payload || state.promptDialogContent,
});

const setPromptDialogContent: CaseReducer<
  CommonState,
  PayloadAction<PromptDialogContentsType>
> = (state, action) => ({
  ...state,
  promptDialogContent: action.payload || null,
});

const setLoginState: CaseReducer<
  CommonState,
  PayloadAction<{ isAuthenticated: boolean; username: string | null }>
> = (state, action) => ({
  ...state,
  isAuthenticated: action.payload.isAuthenticated,
  username: action.payload.username,
});

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setCommonState,
    toggleModal,
    setModalContent,
    setToggleNavbar,
    togglePromptDialog,
    setPromptDialogContent,
    setLoginState,
  },
});

export { commonSlice };

export default persist("common", [], commonSlice.reducer);

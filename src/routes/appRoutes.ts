import Home from "@Views/Home";
import NotesPage from "@Views/Notes";
import ExamsPage from "@Views/Exams";
import ContactsPage from "@Views/Contact";
import VerifyEmail from "@Views/Auth/VerifyEmail";
import { IRoute } from "./types";

const appRoutes: IRoute[] = [
  {
    path: "/",
    name: "Home ",
    component: Home,
    authenticated: false,
  },
  {
    path: "/notes",
    name: "Notes ",
    component: NotesPage,
    authenticated: false,
  },
  {
    path: "/exam",
    name: "Exam ",
    component: ExamsPage,
    authenticated: false,
  },
  {
    path: "/contact",
    name: "Contact ",
    component: ContactsPage,
    authenticated: false,
  },
  {
    path: "/verify-email",
    name: "Verify Email",
    component: VerifyEmail,
    authenticated: false,
  },
];

export default appRoutes;

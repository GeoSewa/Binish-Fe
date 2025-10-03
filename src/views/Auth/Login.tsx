import { useEffect } from "react";
import { useTypedDispatch } from "@Store/hooks";
import { toggleModal } from "@Store/actions/common";
import Home from "@Views/Home";

export default function Login() {
  const dispatch = useTypedDispatch();

  useEffect(() => {
    // Open login modal when visiting /login
    dispatch(toggleModal("login"));
    // Do not auto-close on unmount to respect user action
  }, [dispatch]);

  // Reuse home content while showing the modal
  return <Home />;
}



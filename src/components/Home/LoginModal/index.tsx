import { useState } from "react";
import { FormControl, Input, Label } from "@Components/common/FormUI";
import Icon from "@Components/common/Icon";
import { Flex, FlexRow } from "@Components/common/Layouts";
import { Button } from "@Components/RadixComponents/Button";
import Image from "@Components/RadixComponents/Image";
import Person from '../../../assets/images/Social-Icons/person.svg';
import googleIcon from '../../../assets/images/Social-Icons/google-icon.svg';
import { useForm } from "react-hook-form";
import { signInUser, googleLogin, resetPasswordRequest } from "@Services/common";
import ErrorMessage from "@Components/common/FormUI/ErrorMessage";
import { useTypedDispatch } from "@Store/hooks";
import { toggleModal, setLoginState } from "@Store/actions/common";
import PromptDialog from "@Components/common/PromptDialog";

const initialState = {
  email: "",
  password: "",
};

export default function LoginModal() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isForgotLoading, setIsForgotLoading] = useState<boolean>(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const dispatch = useTypedDispatch();

  // toggle the password visibility
  const handleShow = () => {
    return setShowPassword((prev) => !prev);
  };

  const { register, handleSubmit } = useForm({
    defaultValues: initialState,
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        recaptcha_response: "dummy-recaptcha", // Replace with real token if you implement reCAPTCHA
      };
      const res = await signInUser(payload);
      console.log("Login API Response:", res);
      setSuccess("Login successful!");
      // Store username and token if present
      if (res?.data?.user?.username) {
        localStorage.setItem("username", res.data.user.username);
        dispatch(setLoginState({ isAuthenticated: true, username: res.data.user.username }));
        console.log("Username saved to localStorage and Redux:", res.data.user.username);
      }
      if (res?.data?.access) {
        localStorage.setItem("token", res.data.access);
        console.log("Token saved to localStorage:", res.data.access);
      }
      if (res?.data?.refresh) {
        localStorage.setItem("refresh_token", res.data.refresh);
        console.log("Refresh token saved to localStorage:", res.data.refresh);
      }
      // Close the modal
      dispatch(toggleModal());
      window.dispatchEvent(new Event("authChanged"));
      console.log("Modal toggled off.");
    } catch (err: any) {
      setError(
        err?.response?.data?.detail || err?.response?.data?.message || "Login failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setIsGoogleLoading(true);
    try {
      // You may need to trigger Google OAuth here and get a token, but for now, just call the backend
      const res = await googleLogin({}); // Pass required data if any
      setSuccess("Login successful!");
      if (res?.data?.user?.username) {
        localStorage.setItem("username", res.data.user.username);
        dispatch(setLoginState({ isAuthenticated: true, username: res.data.user.username }));
      }
      if (res?.data?.access) {
        localStorage.setItem("token", res.data.access);
      }
      if (res?.data?.refresh) {
        localStorage.setItem("refresh_token", res.data.refresh);
      }
      dispatch(toggleModal());
      window.dispatchEvent(new Event("authChanged"));
    } catch (err: any) {
      setError(
        err?.response?.data?.detail || err?.response?.data?.message || "Google login failed."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setError("");
    setSuccess("");
    setForgotEmail("");
    setShowForgotModal(true);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsForgotLoading(true);
    try {
      if (!forgotEmail) {
        setError("Please enter your registered email address.");
        setIsForgotLoading(false);
        return;
      }
      await resetPasswordRequest({ email: forgotEmail });
      setSuccess("Password reset email sent successfully, please check your email.");
      setShowForgotModal(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail || err?.response?.data?.message || "Failed to send password reset email."
      );
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <>
      <Flex
        gap={4}
        className="naxatw-w-full naxatw-flex-col naxatw-items-center naxatw-justify-center naxatw-pb-4"
      >
        <Image src={Person} width={60} />
        <h3>Login</h3>

        {/* google login button */}
        <div
          className="naxatw-flex naxatw-w-[60%] naxatw-cursor-pointer naxatw-items-center naxatw-justify-center naxatw-gap-2 naxatw-rounded-lg naxatw-border naxatw-border-grey-800 naxatw-px-5 naxatw-py-2 hover:naxatw-shadow-md"
          onClick={handleGoogleLogin}
        >
          <Image src={googleIcon} />
          <span className="naxatw-text-body-btn">
            {isGoogleLoading ? "Loading..." : "Continue with Google"}
          </span>
        </div>
        {/* google login button */}

        <FlexRow
          className="naxatw-w-full naxatw-items-center naxatw-justify-center"
          gap={3}
        >
          <hr className="naxatw-w-[26%]" />
          <span>or</span>
          <hr className="naxatw-w-[26%]" />
        </FlexRow>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="naxatw-flex naxatw-w-full naxatw-flex-col naxatw-gap-4"
        >
          {error && <ErrorMessage message={error} />}
          {success && (
            <span className="naxatw-text-green-600 naxatw-text-sm naxatw-pt-2">{success}</span>
          )}
          <FormControl>
            <Label htmlFor="username" required>
              Email
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              className="naxatw-mt-1 !naxatw-rounded-lg !naxatw-border-grey-400 !naxatw-p-3"
              {...register("email", { required: true })}
            />
          </FormControl>

          <FormControl className="naxatw-relative">
            <Label htmlFor="password" required>
              Password
            </Label>
            <Input
              id="password"
              placeholder="*******"
              className="naxatw-mt-1 !naxatw-rounded-lg !naxatw-border-grey-400 !naxatw-p-3"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
            />
            <Icon
              name={showPassword ? "visibility" : "visibility_off"}
              className="naxatw-absolute naxatw-right-2 naxatw-top-[55%] naxatw-cursor-pointer naxatw-text-sm naxatw-text-grey-600"
              onClick={() => handleShow()}
            />
          </FormControl>

          <FlexRow className="naxatw-items-center naxatw-justify-between">
            <FlexRow className="naxatw-items-center naxatw-gap-2 naxatw-pl-3">
              <Input type="checkbox" id="check" />
              <Label htmlFor="check">Remember Me</Label>
            </FlexRow>
            <Button
              variant="ghost"
              className="naxatw-text-body-btn !naxatw-text-red"
              onClick={handleForgotPassword}
              type="button"
            >
              {isForgotLoading ? "Sending..." : "Forgot Your Password?"}
            </Button>
          </FlexRow>
          <Button
            className="!naxatw-bg-red naxatw-py-5"
            type="submit"
            withLoader
            isLoading={isLoading}
          >
            Log In
          </Button>
        </form>
      </Flex>
      {/* Forgot Password Modal */}
      <PromptDialog
        title="Reset Password"
        show={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      >
        <form onSubmit={handleForgotSubmit} className="naxatw-flex naxatw-flex-col naxatw-gap-4 naxatw-py-4">
          <Label htmlFor="forgot-email">Enter your registered email address</Label>
          <Input
            id="forgot-email"
            type="email"
            value={forgotEmail}
            onChange={e => setForgotEmail(e.target.value)}
            placeholder="Email"
            required
          />
          {error && <ErrorMessage message={error} />}
          {success && <span className="naxatw-text-green-600 naxatw-text-sm naxatw-pt-2">{success}</span>}
          <Button type="submit" withLoader isLoading={isForgotLoading} className="!naxatw-bg-red">Send Reset Email</Button>
        </form>
      </PromptDialog>
    </>
  );
}

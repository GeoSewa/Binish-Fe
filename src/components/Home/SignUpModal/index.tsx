import { useState } from "react";
import { FormControl, Input, Label } from "@Components/common/FormUI";
import Icon from "@Components/common/Icon";
import { Flex } from "@Components/common/Layouts";
import { Button } from "@Components/RadixComponents/Button";
import { useForm } from "react-hook-form";
import ErrorMessage from "@Components/common/FormUI/ErrorMessage";
import { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { singUpUser } from "@Services/common";
import { useNavigate } from "react-router-dom";
import { useTypedDispatch } from "@Store/hooks";
import { toggleModal, setModalContent } from "@Store/actions/common";

const initialState = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  password: "",
  password_confirm: "",
  phone: "",
  gender: "male",
};

function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();

  const validEmail = validateEmail(email);
  // toggle the password visibility
  const handleShow = () => {
    return setShowPassword((prev) => !prev);
  };

  const closeModal = () => {
    dispatch(toggleModal());
    setTimeout(() => {
      dispatch(setModalContent(null));
    }, 150);
  };

  const { mutate } = useMutation<AxiosResponse<any, any>, any>({
    mutationFn: singUpUser,
    onSuccess: (res: any, variables: any) => {
      setIsLoading(false);
      localStorage.setItem("signup_email", variables.email || variables.get("email"));
      navigate("/verify-email");
      closeModal();
    },
    onError: (err: any) => {
      setIsLoading(false);
      const errorData = err?.response?.data;
      const errorMsg =
        errorData?.detail ||
        (typeof errorData === "string" ? errorData : "") ||
        JSON.stringify(errorData) ||
        "Signup failed.";

      if (
        errorMsg.includes("already exists") ||
        errorMsg.toLowerCase().includes("already registered")
      ) {
        localStorage.setItem("signup_email", email);
        navigate("/verify-email");
        closeModal();
        return;
      }

      setError(errorMsg);
    },
  });
  const { register, handleSubmit, formState } = useForm({
    defaultValues: initialState,
  });

  const onSubmit = (data: any) => {
    setError("");
    setIsLoading(true);
    const modifiedPayload = {
      ...data,
      password_confirm: data.password_confirm,
      is_delete: false,
    };
    mutate(modifiedPayload);
  };

  return (
    <>
      <Flex
        gap={4}
        className="naxatw-w-full naxatw-flex-col naxatw-items-center naxatw-justify-center naxatw-pb-4 sm:naxatw-gap-3 md:naxatw-gap-4"
      >
        <h3 className="naxatw-text-xl naxatw-font-semibold naxatw-mb-2">Sign Up</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="naxatw-flex naxatw-w-full naxatw-flex-col naxatw-gap-4 sm:naxatw-gap-3 md:naxatw-gap-4"
        >
          {error && <ErrorMessage message={error} />}
          <FormControl>
            <Label htmlFor="first_name" required>
              First Name
            </Label>
            <Input
              id="first_name"
              type="text"
              placeholder="First Name"
              className="naxatw-mt-1 !naxatw-rounded-lg !naxatw-border-grey-400 !naxatw-p-3"
              {...register("first_name", {
                required: "First Name is required",
              })}
            />
            <ErrorMessage
              message={formState?.errors?.first_name?.message || ""}
            />
          </FormControl>
          <FormControl>
            <Label htmlFor="username" required>
              Last Name
            </Label>
            <Input
              id="last_name"
              type="text"
              placeholder="Last Name"
              className="naxatw-mt-1 !naxatw-rounded-lg !naxatw-border-grey-400 !naxatw-p-3"
              {...register("last_name", { required: "Last Name is required" })}
            />
            <ErrorMessage
              message={formState?.errors?.last_name?.message || ""}
            />
          </FormControl>

          <FormControl>
            <Label htmlFor="username" required>
              Email
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="something@mail.com"
              className="naxatw-mt-1 !naxatw-rounded-lg !naxatw-border-grey-400 !naxatw-p-3"
              {...register("email", { required: "Email is required" })}
            />
            <ErrorMessage message={formState?.errors?.email?.message || ""} />
          </FormControl>
          <FormControl>
            <Label htmlFor="username" required>
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Phone Number"
              className="naxatw-mt-1 !naxatw-rounded-lg !naxatw-border-grey-400 !naxatw-p-3"
              {...register("phone", { required: "Phone is required" })}
            />
            <ErrorMessage message={formState?.errors?.phone?.message || ""} />
          </FormControl>

          <FormControl>
            <Label htmlFor="username" required>
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              className="naxatw-mt-1 !naxatw-rounded-lg !naxatw-border-grey-400 !naxatw-p-3"
              {...register("username", { required: "Username is required" })}
            />
            <ErrorMessage message={formState?.errors?.username?.message || ""} />
          </FormControl>

          <FormControl className="naxatw-relative">
            <Label htmlFor="password" required>
              Password
            </Label>
            <Input
              placeholder="*******"
              className="naxatw-mt-1 !naxatw-rounded-lg !naxatw-border-grey-400 !naxatw-p-3"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                onChange: (e) => setEmail(e.target.value),
              })}
            />
            <Icon
              name={showPassword ? "visibility" : "visibility_off"}
              className="naxatw-absolute naxatw-right-2 naxatw-top-[55%] naxatw-cursor-pointer naxatw-text-sm naxatw-text-grey-600"
              onClick={() => handleShow()}
            />
            <ErrorMessage
              message={formState?.errors?.password?.message || ""}
            />
          </FormControl>
          <FormControl className="naxatw-relative">
            <Label htmlFor="password_confirm" required>
              Confirm Password
            </Label>
            <Input
              id="password_confirm"
              placeholder="*******"
              className="naxatw-mt-1 !naxatw-rounded-lg !naxatw-border-grey-400 !naxatw-p-3"
              type={showPassword ? "text" : "password"}
              {...register("password_confirm", { required: "Confirm Password is required" })}
            />
            <Icon
              name={showPassword ? "visibility" : "visibility_off"}
              className="naxatw-absolute naxatw-right-2 naxatw-top-[55%] naxatw-cursor-pointer naxatw-text-sm naxatw-text-grey-600"
              onClick={() => handleShow()}
            />
            <ErrorMessage message={formState?.errors?.password_confirm?.message || ""} />
          </FormControl>

          <Button
            className="!naxatw-bg-red naxatw-py-5"
            type="submit"
            withLoader
            isLoading={isLoading}
          >
            Sign Up
          </Button>
        </form>
      </Flex>
    </>
  );
}

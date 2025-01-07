import { useState } from "react";
import { FormControl, Input, Label } from "@Components/common/FormUI";
import Icon from "@Components/common/Icon";
import { Flex } from "@Components/common/Layouts";
import { Button } from "@Components/RadixComponents/Button";
import { useForm } from "react-hook-form";
import ErrorMessage from "@Components/common/FormUI/ErrorMessage";
import prepareFormData from "@Utils/prepareFormData";
import { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { singUpUser } from "@Services/common";

const initialState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
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

  const validEmail = validateEmail(email);
  // toggle the password visibility
  const handleShow = () => {
    return setShowPassword((prev) => !prev);
  };

  const { mutate, isLoading } = useMutation<AxiosResponse<any, any>, unknown>({
    mutationFn: singUpUser,
    onSuccess: (res: any) => console.log(res),
  });
  const { register, handleSubmit, formState } = useForm({
    defaultValues: initialState,
  });

  const onSubmit = (data: any) => {
    const modifiedPayload = {
      ...data,
      confirm_password: data.password,
      is_delete: false,
    };
    const finalPaylisErroroad = prepareFormData(modifiedPayload);
    mutate(finalPaylisErroroad as any);
  };

  return (
    <>
      <Flex
        gap={4}
        className="naxatw-w-full naxatw-flex-col naxatw-items-center naxatw-justify-center naxatw-pb-4"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="naxatw-flex naxatw-w-full naxatw-flex-col naxatw-gap-4"
        >
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
              type="text"
              placeholder="something@mail.com"
              className="naxatw-mt-1 !naxatw-rounded-lg !naxatw-border-grey-400 !naxatw-p-3"
              {...register("phone", { required: "Phone is required" })}
            />
            <ErrorMessage message={formState?.errors?.email?.message || ""} />
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
            <Label htmlFor="password" required>
              Confirm Password
            </Label>
            <Input
              id="password"
              placeholder="*******"
              className="naxatw-mt-1 !naxatw-rounded-lg !naxatw-border-grey-400 !naxatw-p-3"
              type={showPassword ? "text" : "password"}
            />
            <Icon
              name={showPassword ? "visibility" : "visibility_off"}
              className="naxatw-absolute naxatw-right-2 naxatw-top-[55%] naxatw-cursor-pointer naxatw-text-sm naxatw-text-grey-600"
              onClick={() => handleShow()}
            />
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

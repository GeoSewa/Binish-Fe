import { useState } from "react";
import { FormControl, Input, Label } from "@Components/common/FormUI";
import Icon from "@Components/common/Icon";
import { Flex, FlexRow } from "@Components/common/Layouts";
import { Button } from "@Components/RadixComponents/Button";
import Image from "@Components/RadixComponents/Image";
import Person from "@Assets/images/Social-Icons/person.svg";
import googleIcon from "@Assets/images/Social-Icons/google-icon.svg";
import { useForm } from "react-hook-form";

const initialState = {
  email: "",
  password: "",
};

export default function LoginModal() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // toggle the password visibility
  const handleShow = () => {
    return setShowPassword((prev) => !prev);
  };

  const { register, handleSubmit } = useForm({
    defaultValues: initialState,
  });

  const onSubmit = (data: { email: string; password: string }) => {
    console.log(data);
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
        <div className="naxatw-flex naxatw-w-[60%] naxatw-cursor-pointer naxatw-items-center naxatw-justify-center naxatw-gap-2 naxatw-rounded-lg naxatw-border naxatw-border-grey-800 naxatw-px-5 naxatw-py-2 hover:naxatw-shadow-md">
          <Image src={googleIcon} />
          <span className="naxatw-text-body-btn">Continue with Google</span>
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
              onClick={() => {}}
              type="button"
            >
              Forgot Your Password?
            </Button>
          </FlexRow>
          <Button
            className="!naxatw-bg-red naxatw-py-5"
            type="submit"
            withLoader
          >
            Log In
          </Button>
        </form>
      </Flex>
    </>
  );
}

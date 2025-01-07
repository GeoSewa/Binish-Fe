import { formDataAPI } from ".";

export const signInUser = (data: any) =>
  formDataAPI.post("user/sign-in/", data);

export const singUpUser = (data: any) => formDataAPI.post("user/signup/", data);

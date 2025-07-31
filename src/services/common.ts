import { api } from ".";
import axios from "axios";

export const signInUser = (data: any) =>
  api.post("user/login/", data);

export const singUpUser = (data: any) => api.post("user/sign-up/", data);

export const verifyEmailCode = (data: any) => api.post("user/verify/", data);

export const googleLogin = (data: any) =>
  axios.post("https://sujanadh.pythonanywhere.com/api/user/google-login/", data);

export const resetPasswordRequest = (data: any) =>
  axios.post("https://sujanadh.pythonanywhere.com/api/user/reset-password-request/", data);

export const resendVerificationEmail = (data: any) =>
  axios.post("https://sujanadh.pythonanywhere.com/api/user/resend-verification-email/", data);

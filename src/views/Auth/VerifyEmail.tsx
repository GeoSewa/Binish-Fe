import { useState } from "react";
import { FormControl, Input, Label } from "@Components/common/FormUI";
import { Flex } from "@Components/common/Layouts";
import { Button } from "@Components/RadixComponents/Button";
import ErrorMessage from "@Components/common/FormUI/ErrorMessage";
import { verifyEmailCode, resendVerificationEmail } from "@Services/common";

export default function VerifyEmail() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  const email = localStorage.getItem("signup_email");
  if (!email) {
    setError("No email found. Please sign up again.");
  }

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setIsResending(true);
    setAlreadyVerified(false);
    try {
      if (!email) {
        setError("No email found. Please sign up again.");
        setIsResending(false);
        return;
      }
      await resendVerificationEmail({ email });
      setSuccess("Verification email resent successfully. Please check your inbox.");
    } catch (err: any) {
      const apiMsg = err?.response?.data?.detail || err?.response?.data?.message || (typeof err?.response?.data === 'string' ? err?.response?.data : "Failed to resend verification email.");
      setError(apiMsg);
      if (typeof apiMsg === 'string' && apiMsg.toLowerCase().includes('already verified')) {
        setAlreadyVerified(true);
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Flex
      gap={4}
      className="naxatw-w-full naxatw-flex-col naxatw-items-center naxatw-justify-center naxatw-pb-4 naxatw-mt-[60px]"
    >
      <h3 className="naxatw-text-2xl naxatw-font-bold naxatw-mb-2">Verify Your Email</h3>
      <p className="naxatw-text-center naxatw-text-grey-700 naxatw-mb-4 naxatw-max-w-xs">
        Please check your registered email for a verification link. Click the link to verify your email.
      </p>
      {!alreadyVerified && (
        <button
          type="button"
          className="naxatw-text-blue-600 hover:naxatw-underline naxatw-mb-2 naxatw-bg-transparent naxatw-border-0 naxatw-cursor-pointer naxatw-text-base"
          onClick={handleResend}
          disabled={isResending}
        >
          {isResending ? "Resending..." : "Resend verification email"}
        </button>
      )}
      {alreadyVerified && (
        <span className="naxatw-text-green-600 naxatw-text-sm naxatw-pt-2">{error}</span>
      )}
      {!alreadyVerified && error && <ErrorMessage message={error} />}
      {success && (
        <span className="naxatw-text-green-600 naxatw-text-sm naxatw-pt-2">{success}</span>
      )}
    </Flex>
  );
} 
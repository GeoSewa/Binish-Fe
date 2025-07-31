import { useState } from "react";
import { FormControl, Input } from "@Components/common/FormUI";
import { Button } from "@Components/RadixComponents/Button";
import { useTypedDispatch } from "@Store/hooks";
import { setCommonState } from "@Store/actions/common";

export default function EmailVerification() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const dispatch = useTypedDispatch();

  const handleVerify = () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email");
      return;
    }
    
    dispatch(setCommonState({ 
      examView: 'mock-tests',
      userEmail: email 
    }));
  };

  return (
    <section className="naxatw-h-full naxatw-w-full naxatw-p-4">
      <div className="naxatw-max-w-md naxatw-mx-auto naxatw-mt-8">
        <div className="naxatw-bg-white naxatw-p-6 naxatw-rounded-lg naxatw-shadow-md">
          <h2 className="naxatw-text-2xl naxatw-font-semibold naxatw-mb-6 naxatw-text-center">Email Verification</h2>
          
          <FormControl className="naxatw-mb-6">
            <label className="naxatw-block naxatw-text-sm naxatw-font-medium naxatw-mb-2">Enter the Registered Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="naxatw-w-full naxatw-p-2 naxatw-border naxatw-border-gray-300 naxatw-rounded-md focus:naxatw-outline-none focus:naxatw-ring-2 focus:naxatw-ring-primary"
              placeholder="Enter your email"
            />
            {error && (
              <p className="naxatw-text-red-500 naxatw-text-sm naxatw-mt-1">{error}</p>
            )}
          </FormControl>

          <Button
            onClick={handleVerify}
            className="naxatw-w-full naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-rounded-md hover:naxatw-bg-primary/90 focus:naxatw-outline-none focus:naxatw-ring-2 focus:naxatw-ring-primary"
          >
            Verify
          </Button>
        </div>
      </div>
    </section>
  );
} 
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { phone, email, password, fullName } = state || {};

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("OTP required");
      return;
    }

    setLoading(true);

    try {
      const result = await (window as any).confirmationResult.confirm(otp);

      if (!result.user) {
        toast.error("OTP verification failed");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account created 🎉");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center">Verify OTP</h1>

        <Input value={phone} disabled />
        <Input
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <Button className="w-full" onClick={handleVerifyOtp} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  );
}

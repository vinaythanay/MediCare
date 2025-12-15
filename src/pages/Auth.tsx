import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { firebaseSendOtp } from "@/lib/firebase";

// ✅ VALIDATION
const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Auth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signup");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ SINGLE SOURCE OF TRUTH
  const [signUpForm, setSignUpForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  // 🔐 SIGN UP → SEND OTP
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;


    const cleanedForm = {
      fullName: signUpForm.fullName.trim(),
      email: signUpForm.email.trim(),
      phone: signUpForm.phone.trim(),
      password: signUpForm.password.trim(),
    };

    const parsed = signUpSchema.safeParse(cleanedForm);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    const phoneWithCode = `+91${cleanedForm.phone}`;
    setIsSubmitting(true);

    try {
      const confirmationResult = await firebaseSendOtp(phoneWithCode);
      (window as any).confirmationResult = confirmationResult;

      toast.success("OTP sent successfully");

      navigate("/verify-otp", {
        state: { ...cleanedForm, phone: phoneWithCode },
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔐 SIGN IN
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const cleanedForm = {
      email: signInForm.email.trim(),
      password: signInForm.password.trim(),
    };

    if (!cleanedForm.email || !cleanedForm.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      toast.success("Sign in successful");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
        <div className="text-center">
          <Pill className="h-12 w-12 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white">MediCare</h1>
          <p className="text-white/80 mt-2">
            Your trusted online pharmacy
          </p>
          <div className="space-y-4 text-left bg-primary-foreground/10 backdrop-blur rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              <span className="text-primary-foreground/90">Order medicines & healthcare products
</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              <span className="text-primary-foreground/90">Trusted brands & verified quality
</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              <span className="text-primary-foreground/90">Save your favorites</span>
            </div>
        </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in or create an account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
               <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <Input
                  placeholder="Email"
                  value={signInForm.email}
                  onChange={(e) =>
                    setSignInForm({ ...signInForm, email: e.target.value })
                  }
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={signInForm.password}
                  onChange={(e) =>
                    setSignInForm({ ...signInForm, password: e.target.value })
                  }
                />
                <Button className="w-full">Sign In</Button>
              </form>
            </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <Input
                    placeholder="Full Name"
                    value={signUpForm.fullName}
                    onChange={(e) =>
                      setSignUpForm({
                        ...signUpForm,
                        fullName: e.target.value,
                      })
                    }
                  />

                  <Input
                    placeholder="Email"
                    value={signUpForm.email}
                    onChange={(e) =>
                      setSignUpForm({
                        ...signUpForm,
                        email: e.target.value,
                      })
                    }
                  />

                  <Input
                    placeholder="Phone (without +91)"
                    value={signUpForm.phone}
                    onChange={(e) =>
                      setSignUpForm({
                        ...signUpForm,
                        phone: e.target.value,
                      })
                    }
                  />

                  <Input
                    type="password"
                    placeholder="Password"
                    value={signUpForm.password}
                    onChange={(e) =>
                      setSignUpForm({
                        ...signUpForm,
                        password: e.target.value,
                      })
                    }
                  />

                  <Button className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending OTP..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="text-center text-sm">
            By continuing, you agree to our Terms & Privacy Policy
          </CardFooter>
        </Card>
      </div>

      {/* 🔥 REQUIRED FOR FIREBASE */}
      <div id="recaptcha-container"></div>
    </div>
  );
}

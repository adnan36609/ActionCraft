import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

import { auth, googleProvider } from "../firebase";
import { loginApi } from "@/features/auth";
import { setUser } from "@/redux/userSlice";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async (event) => {
    event.preventDefault();

    if (loading) return;

    try {
      setLoading(true);
      setError("");

      // Sign in using Google through Firebase
      const result = await signInWithPopup(auth, googleProvider);

      // Obtain Firebase ID token
      const firebaseToken = await result.user.getIdToken();

      // Authenticate with our Express backend
      // loginApi handles CSRF token and session cookie
      const data = await loginApi(firebaseToken);

      // Update Redux authentication state
      dispatch(setUser(data.user));

      // Navigate after successful backend authentication
      navigate("/", { replace: true });

    } catch (err) {
      console.error("Google login failed:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-white">
            Welcome to ActionCraft
          </CardTitle>

          <CardDescription className="text-sm text-zinc-400">
            Sign in to build and manage your AI agents.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleGoogleLogin}>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full gap-3 rounded-xl border-white/15 bg-white/4 text-sm font-medium text-white transition hover:border-violet-400/50 hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FcGoogle />

                  {loading
                    ? "Signing in..."
                    : "Continue with Google"}
                </Button>
              </Field>

              {error && (
                <Field>
                  <p
                    role="alert"
                    className="text-center text-sm text-red-400"
                  >
                    {error}
                  </p>
                </Field>
              )}

              <Field>
                <FieldDescription className="pt-3 text-center text-xs leading-6 text-zinc-500">
                  By continuing, you agree to our{" "}

                  <a
                    href="/terms"
                    className="text-zinc-300 underline underline-offset-4 transition hover:text-white"
                  >
                    Terms of Service
                  </a>

                  {" "}and{" "}

                  <a
                    href="/privacy"
                    className="text-zinc-300 underline underline-offset-4 transition hover:text-white"
                  >
                    Privacy Policy
                  </a>

                  .
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
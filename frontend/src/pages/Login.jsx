import { useState } from "react";
import { auth, provider } from "../../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ✅ Ensuring error is displayed properly

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
      navigate("/chat"); // Redirect to chat page after login
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError("Failed to sign in with Google. Try again!");
    }
  };

  // Email/Password Sign-In
  const handleEmailSignIn = async () => {
    if (!email || !password) {
      setError("Email and password are required!");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/chat"); // Redirect on success
    } catch (err) {
      setError("Invalid email or password. Try again!"); // ✅ Shows error if login fails
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px] shadow-md border">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Welcome to Chat App
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* ✅ Display error only if there's a message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Email & Password Login Form */}
          <div className="space-y-3">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            onClick={handleEmailSignIn}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          {/* Forgot Password */}
          <div className="text-center text-sm text-gray-500">
            <Link
              to="/reset-password"
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Separator className="my-4" />

          {/* Google Sign-In Button */}
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} /> Sign in with Google
          </Button>

          {/* Signup Link */}
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

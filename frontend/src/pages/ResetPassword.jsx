import { useState } from "react";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      setError("Email is required!");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px] shadow-md border">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && (
            <p className="text-green-500 text-sm text-center">{message}</p>
          )}

          <div className="space-y-3">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            onClick={handleResetPassword}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Sending reset email..." : "Send Reset Link"}
          </Button>

          <p className="text-sm text-center">
            Back to{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;

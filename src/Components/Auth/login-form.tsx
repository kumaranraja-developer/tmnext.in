import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../Chart/card";
import FloatingInput from "../Input/FloatingInput";
import Button from "../Input/Button";
import PasswordInput from "../SecondaryInput/PasswordInput";
import { useAuth } from "@/pages/GlobalContext/AuthContext";

interface LoginProps {
  className?: string;
}
export function LoginForm({ className }: LoginProps) {
  const [usr, setUsr] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [usrError, setUsrError] = useState("");
  const [pwdError, setPwdError] = useState("");
  const { login } = useAuth();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUsrError("");
    setPwdError("");

    if (usr === "" && pwd === "") {
      setUsrError("Username Required");
      setPwdError("Passsword Required");
    } else if (usr === "") {
      setUsrError("Username Required");
    } else if (pwd === "") {
      setPwdError("Username Required");
    } else {
      try {
        await login(usr, pwd);
        console.log("Login success:");
        navigate("/");
      } catch (err: any) {
        setError("Invalid Credential");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center py-2 text-xl font-bold text-update">
            Welcome
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <FloatingInput
                  id="usr"
                  type="text"
                  placeholder="demo@gmail.com"
                  required
                  value={usr}
                  onChange={(e) => setUsr(e.target.value)}
                  label="User"
                  err={usrError}
                />
              </div>
              <div className="grid gap-3">
                <PasswordInput
                  id="pwd"
                  value={pwd}
                  error={pwdError}
                  label="Password"
                  onChange={(e) => setPwd(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-update text-update-foreground"
                  label={"Login"}
                />
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="underline text-update underline-offset-4"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

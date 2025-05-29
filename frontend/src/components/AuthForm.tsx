import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  onAuthSuccess: (token: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/auth";

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${isLogin ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      // Za login, spremi token
      if (isLogin && data.session?.access_token) {
        onAuthSuccess(data.session.access_token);
      } else if (!isLogin) {
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xs mx-auto flex flex-col gap-4 p-6 border rounded-lg bg-background">
      <h2 className="text-xl font-bold mb-2">{isLogin ? "Login" : "Register"}</h2>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={loading}>{loading ? "Loading..." : isLogin ? "Login" : "Register"}</Button>
      <Button type="button" variant="ghost" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </Button>
    </form>
  );
} 
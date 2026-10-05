import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth.ts";
import Button from "../../components/Button.tsx";

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/home";
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectPath, { replace: true });
    }
  }, [loading, navigate, redirectPath, user]);

  async function onSubmit(data: LoginData) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await login(data);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not log in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="panel auth-panel">
        <h1>Login</h1>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email ? <span className="field-error">{errors.email.message}</span> : null}
          </div>
          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password ? <span className="field-error">{errors.password.message}</span> : null}
          </div>
          {submitError ? <p className="field-error" role="alert">{submitError}</p> : null}
          <Button type="submit" disabled={loading || isSubmitting}>
            {loading ? "Checking session..." : isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="auth-links">
          No account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
}

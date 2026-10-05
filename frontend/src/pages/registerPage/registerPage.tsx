import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  checkPassword: string;
  phoneNumber?: string;
  address?: string;
  tin?: string;
}

export default function Registration() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>();
  const password = useWatch({ control, name: "password" });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Could not register your account.");
      }

      navigate("/login");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not register your account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="panel auth-panel">
        <h1>Register</h1>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="first-name">First name</label>
              <input id="first-name" autoComplete="given-name" {...register("firstName", { required: "First name is required" })} />
              {errors.firstName ? <span className="field-error">{errors.firstName.message}</span> : null}
            </div>
            <div className="form-field">
              <label htmlFor="last-name">Last name</label>
              <input id="last-name" autoComplete="family-name" {...register("lastName", { required: "Last name is required" })} />
              {errors.lastName ? <span className="field-error">{errors.lastName.message}</span> : null}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="register-email">Email</label>
            <input id="register-email" type="email" autoComplete="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" } })} />
            {errors.email ? <span className="field-error">{errors.email.message}</span> : null}
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="register-password">Password</label>
              <input id="register-password" type="password" autoComplete="new-password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Use at least 6 characters" } })} />
              {errors.password ? <span className="field-error">{errors.password.message}</span> : null}
            </div>
            <div className="form-field">
              <label htmlFor="confirm-password">Confirm password</label>
              <input id="confirm-password" type="password" autoComplete="new-password" {...register("checkPassword", { required: "Please confirm your password", validate: (value) => value === password || "Passwords do not match" })} />
              {errors.checkPassword ? <span className="field-error">{errors.checkPassword.message}</span> : null}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="phone-number">Phone number</label>
            <input id="phone-number" type="tel" autoComplete="tel" {...register("phoneNumber")} />
          </div>
          <div className="form-field">
            <label htmlFor="address">Address</label>
            <input id="address" autoComplete="street-address" {...register("address")} />
          </div>
          <div className="form-field">
            <label htmlFor="tin">TIN</label>
            <input id="tin" {...register("tin")} />
          </div>
          {submitError ? <p className="field-error" role="alert">{submitError}</p> : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
        <p className="auth-links">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

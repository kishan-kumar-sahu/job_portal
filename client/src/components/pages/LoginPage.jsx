import { useContext, useState } from "react";
import AppContext from "../../context/AppContext.jsx";

export default function AuthScreen({ onAuthenticated, onNotify }) {
  const api = useContext(AppContext);

  const [mode, setMode] = useState("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      if (mode === "register") {
        const chosenRole = payload.role || "candidate";
        await api.register({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: chosenRole,
        });
        await api.login({ email: payload.email, password: payload.password });
        try {
          if (chosenRole === "recruiter") await api.recruiter.create({});
          else await api.candidate.create({});
        } catch {
          // Profile setup can be completed from My profile if it could not be created automatically.
        }
        onNotify("Your account is ready.");
      } else {
        await api.login({ email: payload.email, password: payload.password });
        onNotify("Welcome back.");
      }
      onAuthenticated();
    } catch (e) {
      setError(e.message || "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-shell">
      <div className="auth-art">
        <div className="auth-brand">
          <span className="brand-mark">o</span> orbit
          <span className="brand-light">hire</span>
        </div>
        <div className="auth-art-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> YOUR CAREER, IN MOTION
          </div>
          <h1>
            Find work that
            <br />
            <em>moves you forward.</em>
          </h1>
          <p>
            A thoughtful workspace for your next opportunity. Discover roles,
            sharpen your story, and keep every step in one place.
          </p>
          <div className="auth-stats">
            <div>
              <strong>01</strong>
              <span>Find your fit</span>
            </div>
            <div>
              <strong>02</strong>
              <span>Show your value</span>
            </div>
            <div>
              <strong>03</strong>
              <span>Make your move</span>
            </div>
          </div>
        </div>
        <div className="auth-decoration decor-one" />
        <div className="auth-decoration decor-two" />
        <div className="auth-art-bottom">
          A better way to work toward what’s next. <span>✦</span>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-panel-top">
          <span>Welcome to OrbitHire</span>
          <span className="secure-label">⌑ Secure access</span>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-heading">
            {mode === "login" ? "Welcome back" : "Create your account"}
            <p>
              {mode === "login"
                ? "Sign in to continue to your workspace."
                : "A few details and you're on your way."}
            </p>
          </div>
          <form onSubmit={onSubmit} className="form-stack">
            {mode === "register" && (
              <label>
                Full name
                <input
                  name="name"
                  placeholder="e.g. Kishan Kumar Sahu"
                  required
                  autoComplete="name"
                />
              </label>
            )}
            <label>
              Email address
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                minLength={mode === "register" ? 8 : undefined}
                required
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </label>
            {mode === "register" && (
              <label>
                Join as
                <select name="role" defaultValue="candidate">
                  <option value="candidate">
                    Candidate — find your next role
                  </option>
                  <option value="recruiter">
                    Recruiter — find great people
                  </option>
                </select>
              </label>
            )}
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary btn-full" disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in to workspace"
                  : "Create account"}{" "}
              <span>→</span>
            </button>
          </form>
          <div className="auth-switch">
            {mode === "login"
              ? "New to OrbitHire?"
              : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </div>
          <div className="auth-note">
            <span>✦</span> Your next opportunity is closer than you think.
          </div>
        </div>
        <div className="auth-panel-bottom">
          By continuing, you agree to our <a href="#terms">Terms</a> and{" "}
          <a href="#privacy">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}

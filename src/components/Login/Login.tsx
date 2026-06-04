import { useState } from "react";
import type { KeyboardEvent } from "react";
import "./Login.css";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "signin" | "signup";
type StrengthLevel = "weak" | "fair" | "good" | "strong";

interface StrengthResult {
  score: number;
  level: StrengthLevel | null;
}

interface LoginPageProps {
  onSuccess?: (method: "email" | "google" | "github") => void;
}

// ─── Helper: password strength ───────────────────────────────────────────────

function getStrength(password: string): StrengthResult {
  if (!password) return { score: 0, level: null };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels: StrengthLevel[] = ["weak", "fair", "good", "strong"];
  return { score, level: levels[score - 1] ?? "weak" };
}

// ─── Sub-component: StrengthBar ───────────────────────────────────────────────

function StrengthBar({ password }: { password: string }) {
  const { score, level } = getStrength(password);
  if (!password) return null;

  const labels: Record<StrengthLevel, string> = {
    weak: "Weak", fair: "Fair", good: "Good", strong: "Strong",
  };

  return (
    <div className="login-pw-strength">
      <div className="login-pw-bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`login-pw-bar ${i <= score && level ? `filled-${level}` : ""}`}
          />
        ))}
      </div>
      {level && (
        <span className={`login-pw-label ${level}`}>{labels[level]}</span>
      )}
    </div>
  );
}

// ─── Sub-component: GoogleIcon ────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/>
      <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067A11.965 11.965 0 0012 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/>
      <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"/>
      <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/>
    </svg>
  );
}

// ─── Sub-component: GithubIcon ────────────────────────────────────────────────

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [showPw, setShowPw] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const showError = (msg: string): void => {
    setError(msg);
    setTimeout(() => setError(""), 3500);
  };

  const validate = (): boolean => {
    if (!email) { showError("Please enter your email address"); return false; }
    if (!email.includes("@")) { showError("Please enter a valid email address"); return false; }
    if (!password) { showError("Please enter your password"); return false; }
    if (tab === "signup" && password.length < 8) {
      showError("Password must be at least 8 characters"); return false;
    }
    return true;
  };

  const handleSubmit = (): void => {
    if (!validate()) return;
    setLoading(true);
    // TODO: replace with real auth API call
    // e.g. await authService.login({ email, password })
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onSuccess?.("email");
    }, 1200);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSocialLogin = (provider: "google" | "github"): void => {
    setLoading(true);
    // TODO: replace with OAuth flow
    // e.g. await authService.socialLogin(provider)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onSuccess?.(provider);
    }, 1000);
  };

  const stats: Array<[string, string]> = [
    ["91%", "avg match score"],
    ["3.2×", "more interviews"],
    ["8", "roles tracked"],
    ["5 min", "setup time"],
  ];

  // ─── Success State ──────────────────────────────────────────────────────────

  if (success) {
    return (
      <div style={{ padding: "1rem 0" }}>
        <div className="login-page">
          <LeftPanel stats={stats} />
          <div className="login-right">
            <div className="login-success">
              <div className="login-success-icon">✓</div>
              <h3>Signed in successfully</h3>
              <p>Redirecting to your dashboard...</p>
              <button className="login-success-btn">
                Go to dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Form ──────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: "1rem 0" }}>
      <div className="login-page">
        <LeftPanel stats={stats} />

        <div className="login-right">

          {/* Tab switcher */}
          <div className="login-tabs" role="tablist">
            {(["signin", "signup"] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`login-tab ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="login-form-header">
            <h3>{tab === "signin" ? "Welcome back" : "Get started free"}</h3>
            <p>
              {tab === "signin"
                ? "Sign in to your JobTrackr account"
                : "Create your account and start tracking"}
            </p>
          </div>

          {/* Social buttons */}
          <div className="login-social-row">
            <button
              className="login-social-btn"
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              aria-label="Continue with Google"
            >
              <GoogleIcon /> Continue with Google
            </button>
            <button
              className="login-social-btn"
              onClick={() => handleSocialLogin("github")}
              disabled={loading}
              aria-label="Continue with GitHub"
            >
              <GithubIcon /> Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="login-divider" role="separator">
            <div className="login-divider-line" />
            <span className="login-divider-text">or with email</span>
            <div className="login-divider-line" />
          </div>

          {/* Error message */}
          {error && (
            <div className="login-error" role="alert">
              ⚠ {error}
            </div>
          )}

          {/* Name fields (signup only) */}
          {tab === "signup" && (
            <div className="login-name-row">
              {[
                { label: "First name", value: firstName, setter: setFirstName },
                { label: "Last name", value: lastName, setter: setLastName },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="login-label">{label}</label>
                  <div className="login-input-wrap">
                    <input
                      className="login-input"
                      type="text"
                      placeholder={label}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      autoComplete={label === "First name" ? "given-name" : "family-name"}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Email */}
          <div className="login-field">
            <label htmlFor="login-email" className="login-label">
              Email address
            </label>
            <div className="login-input-wrap">
              <input
                id="login-email"
                className="login-input"
                type="email"
                placeholder="ifaquadar@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
                aria-required="true"
              />
              <span className="login-input-icon" aria-hidden="true">✉</span>
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="login-password" className="login-label">
              Password
            </label>
            <div className="login-input-wrap">
              <input
                id="login-password"
                className="login-input"
                type={showPw ? "text" : "password"}
                placeholder={
                  tab === "signin" ? "Enter your password" : "Create a strong password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete={tab === "signin" ? "current-password" : "new-password"}
                aria-required="true"
              />
              <button
                type="button"
                className="login-input-icon"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
            {tab === "signup" && <StrengthBar password={password} />}
          </div>

          {/* Forgot password */}
          {tab === "signin" && (
            <button className="login-forgot" type="button">
              Forgot password?
            </button>
          )}

          {/* Submit */}
          <button
            className="login-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
            aria-busy={loading}
          >
            {loading
              ? "Please wait..."
              : tab === "signin"
              ? "→ Sign in"
              : "→ Create account"}
          </button>

          {/* Terms */}
          <p className="login-terms">
            By continuing you agree to our{" "}
            <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component: LeftPanel ─────────────────────────────────────────────────

interface LeftPanelProps {
  stats: Array<[string, string]>;
}

function LeftPanel({ stats }: LeftPanelProps) {
  return (
    <div className="login-left">
      <div>
        <div className="login-logo">
          <div className="login-logo-icon">💼</div>
          <span className="login-logo-text">JobTrackr AI</span>
        </div>
        <div className="login-headline">
          <h2>Land your next role faster with AI</h2>
          <p>
            Track applications, get AI-powered resume feedback, and never miss
            a follow-up — all in one place.
          </p>
        </div>
        <div className="login-stats">
          {stats.map(([value, label]) => (
            <div key={label} className="login-stat">
              <div className="login-stat-value">{value}</div>
              <div className="login-stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="login-testimonial">
        <p>
          "Got my Redfin interview within 2 weeks of using JobTrackr.
          The AI resume feedback was spot on."
        </p>
        <div className="login-testimonial-author">
          <div className="login-avatar">IQ</div>
          <span>Ifa Q. · Software Engineer · Seattle</span>
        </div>
      </div>
    </div>
  );
}

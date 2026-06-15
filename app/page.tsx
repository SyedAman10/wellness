"use client";

import { useState, useRef, useCallback } from "react";
import "./landing.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const value = email.trim();

      if (!value) {
        setError("Please enter your email to claim your spot.");
        return;
      }
      if (!EMAIL_RE.test(value)) {
        setError("That email doesn’t look quite right — please check it.");
        return;
      }

      setError(null);

      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: value }),
        });

        if (res.status === 409) {
          setError("You’re already on the list.");
          return;
        }

        if (!res.ok) {
          setError("Something went wrong. Please try again.");
          return;
        }

        const form = formRef.current;
        if (form) {
          form.style.transition = "opacity 0.4s ease, transform 0.4s ease";
          form.style.opacity = "0";
          form.style.transform = "translateY(-6px)";
          form.style.pointerEvents = "none";
        }

        setTimeout(() => setSubmitted(true), 380);
      } catch {
        setError("Network error. Please try again.");
      }
    },
    [email]
  );

  return (
    <>
      <svg className="grain" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <div className="glow" aria-hidden="true" />

      <svg className="vine vine--tl" viewBox="0 0 240 240" aria-hidden="true">
        <path className="stem" d="M6,4 C 36,40 44,74 40,108 C 36,142 52,168 92,190 C 124,207 150,206 176,198" />
        <path className="stem" d="M40,108 C 58,104 78,112 92,132" style={{ strokeDasharray: 120, strokeDashoffset: 120, animationDelay: "1.2s" }} />
        <g>
          <path className="leaf"       d="M0,0 C 9,-11 27,-9 30,0 C 27,9 9,11 0,0 Z" transform="translate(40,108) rotate(-30)" style={{ animationDelay: "1.6s" }} />
          <path className="leaf amber" d="M0,0 C 8,-10 24,-8 27,0 C 24,8 8,10 0,0 Z" transform="translate(34,66) rotate(-70)"  style={{ animationDelay: "1.6s" }} />
          <path className="leaf"       d="M0,0 C 9,-11 27,-9 30,0 C 27,9 9,11 0,0 Z" transform="translate(64,168) rotate(20)"  style={{ animationDelay: "2s"   }} />
          <path className="leaf amber" d="M0,0 C 7,-9 22,-7 25,0 C 22,7 7,9 0,0 Z"   transform="translate(92,132) rotate(40)"  style={{ animationDelay: "2.3s" }} />
          <path className="leaf"       d="M0,0 C 8,-10 24,-8 27,0 C 24,8 8,10 0,0 Z" transform="translate(128,196) rotate(8)" style={{ animationDelay: "2.6s" }} />
        </g>
      </svg>

      <svg className="vine vine--br" viewBox="0 0 240 240" aria-hidden="true">
        <path className="stem" d="M6,4 C 36,40 44,74 40,108 C 36,142 52,168 92,190 C 124,207 150,206 176,198" />
        <path className="stem" d="M40,108 C 58,104 78,112 92,132" style={{ strokeDasharray: 120, strokeDashoffset: 120, animationDelay: "1.7s" }} />
        <g>
          <path className="leaf amber" d="M0,0 C 9,-11 27,-9 30,0 C 27,9 9,11 0,0 Z" transform="translate(40,108) rotate(-30)" style={{ animationDelay: "2s"   }} />
          <path className="leaf"       d="M0,0 C 8,-10 24,-8 27,0 C 24,8 8,10 0,0 Z" transform="translate(34,66) rotate(-70)"  style={{ animationDelay: "2.3s" }} />
          <path className="leaf amber" d="M0,0 C 9,-11 27,-9 30,0 C 27,9 9,11 0,0 Z" transform="translate(64,168) rotate(20)"  style={{ animationDelay: "2.6s" }} />
          <path className="leaf"       d="M0,0 C 7,-9 22,-7 25,0 C 22,7 7,9 0,0 Z"   transform="translate(92,132) rotate(40)"  style={{ animationDelay: "2.9s" }} />
        </g>
      </svg>

      <main className="stage">
        <section className="hero">

          <div className="seal reveal">
            <span className="ring"><span className="ring-diamond" /></span>
            <span className="wordmark">Aya<em>Vine</em> Wellness</span>
          </div>

          <p className="eyebrow reveal">Grandmother Caapi Vine · Est. in tradition</p>

          <h1 className="headline reveal">
            Something <em>exciting</em><br />is coming.
          </h1>

          <div className="divider reveal">
            <span className="rule" />
            <span className="dot" />
            <span className="rule" />
          </div>

          <p className="sub reveal">
            Our full website will be live shortly. Be the first to know when we launch.
            Join our list now and if you&apos;re among the <strong>first 100</strong>{" "}to sign up, you&apos;ll unlock an exclusive offer the moment we go live.
          </p>

          <div className="capture reveal">
            {!submitted && (
              <>
                <form ref={formRef} onSubmit={handleSubmit} noValidate>
                  <div className="form-row">
                    <input
                      type="email"
                      className={`email-input${error ? " error" : ""}`}
                      placeholder="Your email address"
                      autoComplete="email"
                      aria-label="Email address"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearError(); }}
                    />
                    <button type="submit" className="cta-btn">Join the First 100</button>
                  </div>
                </form>
                {error && <p className="msg show" role="alert">{error}</p>}
              </>
            )}

            <div className={`confirm${submitted ? " show" : ""}`}>
              <div className="check-mark">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5 L10 18 L20 6" /></svg>
              </div>
              <h2>You&apos;re on the list.</h2>
              <p>A place has been held for you among the <span className="who">first 100</span>. We&apos;ll reach out the moment the vine awakens.</p>
            </div>
          </div>

          <p className="disclaimer reveal">AyaVine products are not for use with SSRIs, alcohol, or street drugs.</p>

        </section>
      </main>
    </>
  );
}

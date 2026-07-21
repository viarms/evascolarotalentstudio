// src/components/layout/FeedbackModal.tsx
//
// Replicates WPForms form 1045 (the real feedback form behind the WP
// Elementor popup). Fields: Your name, Email + Confirm, Type of Feedback,
// Phone, Write Feedback.
//
// Opened via: window.dispatchEvent(new Event("open-feedback-modal"))
// Closes on:  × button | backdrop click | Escape key
// Submits to: POST /api/feedback  →  proxied server-side to WPForms.

"use client";

import { useEffect, useRef, useCallback, useState, useId } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormFields {
  name:     string;
  email:    string;
  emailCfm: string;
  type:     string;
  phone:    string;
  feedback: string;
}

interface FieldErrors {
  email?:    string;
  emailCfm?: string;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

const EMPTY: FormFields = {
  name: "", email: "", emailCfm: "", type: "", phone: "", feedback: "",
};

const FEEDBACK_TYPES = [
  "General Feedback from Parents/Students",
  "Positive Feedback",
  "Suggestion or Complaints",
  "Studio Maintenance or Repairs",
  "Website Errors",
  "Other",
];

// ── Validation ────────────────────────────────────────────────────────────────

function validate(f: FormFields): FieldErrors {
  const errors: FieldErrors = {};
  if (!f.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!f.emailCfm.trim()) {
    errors.emailCfm = "Please confirm your email.";
  } else if (f.email !== f.emailCfm) {
    errors.emailCfm = "Email addresses do not match.";
  }
  return errors;
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputBase =
  "w-full px-3 py-2.5 text-sm text-gray-900 bg-white border rounded-sm " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b91c1c] " +
  "focus:border-transparent transition-colors duration-150 disabled:opacity-50";

const cls = {
  ok:    `${inputBase} border-gray-300`,
  error: `${inputBase} border-red-500 bg-red-50`,
  label: "block text-xs font-medium text-gray-700 mb-1",
  field: "mb-4",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function FeedbackModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const uid       = useId();
  const lenis     = useLenis();

  const [fields,    setFields]    = useState<FormFields>(EMPTY);
  const [errors,    setErrors]    = useState<FieldErrors>({});
  const [touched,   setTouched]   = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [status,    setStatus]    = useState<SubmitState>("idle");
  const [serverMsg, setServerMsg] = useState("");

  // ── Open / close ───────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setFields(EMPTY); setErrors({}); setTouched({});
    setStatus("idle"); setServerMsg("");
  }, []);

  const openModal = useCallback(() => {
    reset();
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
    lenis?.stop();
  }, [reset, lenis]);

  const closeModal = useCallback(() => {
    dialogRef.current?.close();
    document.body.style.overflow = "";
    lenis?.start();
  }, [lenis]);

  useEffect(() => {
    // Ensure dialog is closed on mount — guards against HMR / StrictMode remounts
    const dialog = dialogRef.current;
    if (dialog?.open) {
      dialog.close();
      document.body.style.overflow = "";
      lenis?.start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("open-feedback-modal", openModal);
    return () => window.removeEventListener("open-feedback-modal", openModal);
  }, [openModal]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = () => { document.body.style.overflow = ""; lenis?.start(); };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) closeModal();
  };

  // ── Field handlers ─────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const next = { ...fields, [name]: value };
    setFields(next);
    if (touched[name as keyof FormFields]) setErrors(validate(next));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = e.target.name as keyof FormFields;
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(validate({ ...fields, [name]: e.target.value }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, emailCfm: true });
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("submitting");
    setServerMsg("");

    try {
      const res  = await fetch("/api/feedback", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(fields),
      });
      const data = await res.json() as { ok: boolean; message: string };

      if (data.ok) { setStatus("success"); setServerMsg(data.message); }
      else         { setStatus("error");   setServerMsg(data.message ?? "Something went wrong. Please try again."); }
    } catch {
      setStatus("error");
      setServerMsg("Network error. Please check your connection and try again.");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby={`${uid}-title`}
      aria-modal="true"
      className="
        m-auto w-full max-w-[540px] max-h-[90dvh]
        rounded-sm shadow-2xl border-0 p-0 bg-white
        flex flex-col
        backdrop:bg-black/60 backdrop:backdrop-blur-sm
      "
      style={{ zIndex: 9999 }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ backgroundColor: "#121212" }}
      >
        <h2
          id={`${uid}-title`}
          className="text-base font-semibold tracking-wide text-white m-0"
          style={{ fontFamily: "var(--font-archivo-black, sans-serif)" }}
        >
          Feedback
        </h2>
        <button
          type="button" onClick={closeModal} aria-label="Close feedback form"
          className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400
            hover:text-white hover:bg-white/10 transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="px-6 py-6">

          {/* ── Success ── */}
          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                     className="w-7 h-7 text-green-600">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-gray-900 font-medium">{serverMsg}</p>
              <p className="text-sm text-gray-500">
                We appreciate your feedback and will be in touch if needed.
              </p>
              <button
                type="button" onClick={closeModal}
                className="mt-2 px-6 py-2.5 text-sm font-medium text-white rounded-sm
                  bg-[#b91c1c] hover:bg-[#991b1b] transition-colors duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c] focus-visible:ring-offset-2"
              >
                Close
              </button>
            </div>

          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <p className="text-sm text-gray-500 mb-5">
                Fields marked{" "}
                <span aria-hidden="true" className="text-red-600 font-medium">*</span>
                {" "}are required.
              </p>

              {/* Your name */}
              <div className={cls.field}>
                <label htmlFor={`${uid}-name`} className={cls.label}>Your Name</label>
                <input
                  id={`${uid}-name`} name="name" type="text" autoComplete="name"
                  value={fields.name} onChange={handleChange} onBlur={handleBlur}
                  disabled={status === "submitting"}
                  className={cls.ok} placeholder="Full name"
                />
              </div>

              {/* Email + Confirm Email side by side */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label htmlFor={`${uid}-email`} className={cls.label}>
                    Email <span aria-hidden="true" className="text-red-600">*</span>
                  </label>
                  <input
                    id={`${uid}-email`} name="email" type="email" autoComplete="email"
                    value={fields.email} onChange={handleChange} onBlur={handleBlur}
                    disabled={status === "submitting"}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? `${uid}-email-err` : undefined}
                    className={errors.email ? cls.error : cls.ok}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p id={`${uid}-email-err`} role="alert" className="mt-1 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor={`${uid}-emailCfm`} className={cls.label}>
                    Confirm Email <span aria-hidden="true" className="text-red-600">*</span>
                  </label>
                  <input
                    id={`${uid}-emailCfm`} name="emailCfm" type="email" autoComplete="email"
                    value={fields.emailCfm} onChange={handleChange} onBlur={handleBlur}
                    disabled={status === "submitting"}
                    aria-invalid={!!errors.emailCfm}
                    aria-describedby={errors.emailCfm ? `${uid}-emailCfm-err` : undefined}
                    className={errors.emailCfm ? cls.error : cls.ok}
                    placeholder="Confirm email"
                  />
                  {errors.emailCfm && (
                    <p id={`${uid}-emailCfm-err`} role="alert" className="mt-1 text-xs text-red-600">
                      {errors.emailCfm}
                    </p>
                  )}
                </div>
              </div>

              {/* Type of Feedback */}
              <div className={cls.field}>
                <label htmlFor={`${uid}-type`} className={cls.label}>Type of Feedback</label>
                <select
                  id={`${uid}-type`} name="type"
                  value={fields.type} onChange={handleChange} onBlur={handleBlur}
                  disabled={status === "submitting"}
                  className={`${cls.ok} cursor-pointer`}
                >
                  <option value="">— Select —</option>
                  {FEEDBACK_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div className={cls.field}>
                <label htmlFor={`${uid}-phone`} className={cls.label}>Phone</label>
                <input
                  id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel"
                  value={fields.phone} onChange={handleChange} onBlur={handleBlur}
                  disabled={status === "submitting"}
                  className={cls.ok} placeholder="628xxxxxxxxxx (include country code, no +)"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Include country code without &ldquo;+&rdquo;. E.g. 628xxxxxxxxxx
                </p>
              </div>

              {/* Write Feedback */}
              <div className={cls.field}>
                <label htmlFor={`${uid}-feedback`} className={cls.label}>Write Feedback</label>
                <textarea
                  id={`${uid}-feedback`} name="feedback" rows={4}
                  value={fields.feedback} onChange={handleChange} onBlur={handleBlur}
                  disabled={status === "submitting"}
                  className={`${cls.ok} resize-y min-h-[96px]`}
                  placeholder="Please write your feedback here…"
                />
              </div>

              {/* Server error */}
              {status === "error" && serverMsg && (
                <div role="alert"
                     className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-sm
                       bg-red-50 border border-red-200 text-sm text-red-700">
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor"
                       className="w-4 h-4 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0v4.5zm.75-7a1 1 0 110 2 1 1 0 010-2z"
                      clipRule="evenodd" />
                  </svg>
                  {serverMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit" disabled={status === "submitting"}
                className="w-full flex items-center justify-center gap-2
                  px-6 py-3 text-sm font-semibold text-white rounded-sm
                  bg-[#b91c1c] hover:bg-[#991b1b] active:bg-[#7f1d1d]
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-colors duration-150
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-[#b91c1c] focus-visible:ring-offset-2"
                style={{ fontFamily: "var(--font-archivo-black, sans-serif)" }}
              >
                {status === "submitting" ? (
                  <>
                    <svg aria-hidden="true" className="w-4 h-4 animate-spin" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Sending…
                  </>
                ) : "Submit"}
              </button>
            </form>
          )}

        </div>
      </div>
    </dialog>
  );
}

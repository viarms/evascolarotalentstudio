"use client";
// src/components/modals/FeedbackModal.tsx
// Opened via: window.dispatchEvent(new Event("open-feedback-modal"))
// Submits to: POST /api/feedback

import { useEffect, useCallback, useState, useId } from "react";
import ModalShell from "./ModalShell";

const FEEDBACK_TYPES = [
  "General Feedback from Parents/Students",
  "Positive Feedback",
  "Suggestion or Complaints",
  "Studio Maintenance or Repairs",
  "Website Errors",
  "Other",
];

interface FormFields {
  name: string; email: string; emailCfm: string;
  type: string; phone: string; feedback: string;
}
interface FieldErrors { email?: string; emailCfm?: string; }
type SubmitState = "idle" | "submitting" | "success" | "error";

const EMPTY: FormFields = { name: "", email: "", emailCfm: "", type: "", phone: "", feedback: "" };

function validate(f: FormFields): FieldErrors {
  const e: FieldErrors = {};
  if (!f.email.trim()) {
    e.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    e.email = "Enter a valid email address.";
  }
  if (!f.emailCfm.trim()) {
    e.emailCfm = "Please confirm your email.";
  } else if (f.email !== f.emailCfm) {
    e.emailCfm = "Email addresses do not match.";
  }
  return e;
}

const inputBase =
  "w-full px-3 py-2.5 text-sm text-gray-900 bg-white border rounded-sm " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b91c1c] " +
  "focus:border-transparent transition-colors duration-150 disabled:opacity-50";
const cls = {
  ok:    `${inputBase} border-gray-300`,
  err:   `${inputBase} border-red-500 bg-red-50`,
  label: "block text-xs font-medium text-gray-700 mb-1",
  field: "mb-4",
};

export default function FeedbackModal() {
  const uid = useId();
  const [isOpen,    setIsOpen]    = useState(false);
  const [fields,    setFields]    = useState<FormFields>(EMPTY);
  const [errors,    setErrors]    = useState<FieldErrors>({});
  const [touched,   setTouched]   = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [status,    setStatus]    = useState<SubmitState>("idle");
  const [serverMsg, setServerMsg] = useState("");

  const open = useCallback(() => {
    setFields(EMPTY); setErrors({}); setTouched({});
    setStatus("idle"); setServerMsg("");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    window.addEventListener("open-feedback-modal", open);
    return () => window.removeEventListener("open-feedback-modal", open);
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const next = { ...fields, [name]: value };
    setFields(next);
    if (touched[name as keyof FormFields]) setErrors(validate(next));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name as keyof FormFields;
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(validate({ ...fields, [name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, emailCfm: true });
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStatus("submitting");
    try {
      const res  = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
      const data = await res.json() as { ok: boolean; message: string };
      if (data.ok) { setStatus("success"); setServerMsg(data.message); }
      else         { setStatus("error");   setServerMsg(data.message ?? "Something went wrong."); }
    } catch {
      setStatus("error");
      setServerMsg("Network error. Please try again.");
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={close} title="Feedback" titleId={`${uid}-title`} maxWidth="540px">
      {status === "success" ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-green-600"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <p className="text-gray-900 font-medium">{serverMsg}</p>
          <p className="text-sm text-gray-500">We appreciate your feedback and will be in touch if needed.</p>
          <button type="button" onClick={close} className="mt-2 px-6 py-2.5 text-sm font-medium text-white rounded-sm bg-[#b91c1c] hover:bg-[#991b1b] transition-colors">Close</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <p className="text-sm text-gray-500 mb-5">Fields marked <span className="text-red-600 font-medium">*</span> are required.</p>

          <div className={cls.field}>
            <label htmlFor={`${uid}-name`} className={cls.label}>Your Name</label>
            <input id={`${uid}-name`} name="name" type="text" autoComplete="name" value={fields.name} onChange={handleChange} onBlur={handleBlur} disabled={status === "submitting"} className={cls.ok} placeholder="Full name" />
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label htmlFor={`${uid}-email`} className={cls.label}>Email <span className="text-red-600">*</span></label>
              <input id={`${uid}-email`} name="email" type="email" autoComplete="email" value={fields.email} onChange={handleChange} onBlur={handleBlur} disabled={status === "submitting"} className={errors.email ? cls.err : cls.ok} placeholder="you@example.com" />
              {errors.email && <p role="alert" className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div className="flex-1">
              <label htmlFor={`${uid}-emailCfm`} className={cls.label}>Confirm Email <span className="text-red-600">*</span></label>
              <input id={`${uid}-emailCfm`} name="emailCfm" type="email" autoComplete="email" value={fields.emailCfm} onChange={handleChange} onBlur={handleBlur} disabled={status === "submitting"} className={errors.emailCfm ? cls.err : cls.ok} placeholder="Confirm email" />
              {errors.emailCfm && <p role="alert" className="mt-1 text-xs text-red-600">{errors.emailCfm}</p>}
            </div>
          </div>

          <div className={cls.field}>
            <label htmlFor={`${uid}-type`} className={cls.label}>Type of Feedback</label>
            <select id={`${uid}-type`} name="type" value={fields.type} onChange={handleChange} onBlur={handleBlur} disabled={status === "submitting"} className={`${cls.ok} cursor-pointer`}>
              <option value="">— Select —</option>
              {FEEDBACK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className={cls.field}>
            <label htmlFor={`${uid}-phone`} className={cls.label}>Phone</label>
            <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" value={fields.phone} onChange={handleChange} onBlur={handleBlur} disabled={status === "submitting"} className={cls.ok} placeholder="628xxxxxxxxxx" />
            <p className="mt-1 text-xs text-gray-400">Include country code without &ldquo;+&rdquo;. E.g. 628xxxxxxxxxx</p>
          </div>

          <div className={cls.field}>
            <label htmlFor={`${uid}-feedback`} className={cls.label}>Write Feedback</label>
            <textarea id={`${uid}-feedback`} name="feedback" rows={4} value={fields.feedback} onChange={handleChange} onBlur={handleBlur} disabled={status === "submitting"} className={`${cls.ok} resize-y min-h-[96px]`} placeholder="Please write your feedback here…" />
          </div>

          {status === "error" && serverMsg && (
            <div role="alert" className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-sm bg-red-50 border border-red-200 text-sm text-red-700">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0v4.5zm.75-7a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" /></svg>
              {serverMsg}
            </div>
          )}

          <button type="submit" disabled={status === "submitting"}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-sm bg-[#b91c1c] hover:bg-[#991b1b] active:bg-[#7f1d1d] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            style={{ fontFamily: "var(--font-archivo-black, sans-serif)" }}>
            {status === "submitting" ? (<><svg aria-hidden="true" className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>Sending…</>) : "Submit"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}

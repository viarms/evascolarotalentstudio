"use client";
// src/components/modals/BookTrialModal.tsx
// Opened via: window.dispatchEvent(new Event("open-book-trial-modal"))
// Submits to: POST /api/book-trial

import { useEffect, useCallback, useState, useId } from "react";
import ModalShell from "./ModalShell";

const CLASSES = [
  "Hip-Hop","Ballet","Singing","K-Pop Dance","Jazz Dance",
  "Drama & Musical Theatre","Modeling","Breakdance","Public Speaking",
] as const;
const STUDIOS = ["Sanur Studio", "Canggu Studio"] as const;
const DAYS    = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] as const;

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6282146284464";
const WA_HREF   = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi, I'd like to book a free trial class!")}`;

interface FormFields {
  parentName: string; childName: string; childAge: string;
  classInterest: string; studio: string; preferredDay: string;
  whatsapp: string; email: string;
}
interface FieldErrors {
  parentName?: string; childName?: string; childAge?: string;
  classInterest?: string; studio?: string; whatsapp?: string; email?: string;
}
type SubmitState = "idle" | "submitting" | "success" | "error";

const EMPTY: FormFields = {
  parentName: "", childName: "", childAge: "", classInterest: "",
  studio: "", preferredDay: "", whatsapp: "", email: "",
};

function validate(f: FormFields): FieldErrors {
  const e: FieldErrors = {};
  if (!f.parentName.trim())   e.parentName    = "Parent / Guardian name is required.";
  if (!f.childName.trim())    e.childName     = "Child's name is required.";
  if (!f.childAge.trim()) {
    e.childAge = "Child's age is required.";
  } else {
    const age = parseInt(f.childAge, 10);
    if (isNaN(age) || age < 3 || age > 16) e.childAge = "Age must be between 3 and 16.";
  }
  if (!f.classInterest)       e.classInterest = "Please select a class.";
  if (!f.studio)              e.studio        = "Please select a studio.";
  if (!f.whatsapp.trim()) {
    e.whatsapp = "WhatsApp number is required.";
  } else if (!/^\d{7,15}$/.test(f.whatsapp.replace(/\s/g, ""))) {
    e.whatsapp = "Enter a valid number without + (e.g. 628xxxxxxxxxx).";
  }
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = "Enter a valid email address.";
  return e;
}

// ── Dark glass form primitives ────────────────────────────────────────────────
const inputBase = [
  "w-full px-3 py-2.5 text-sm rounded-md",
  "bg-white/[0.07] border",
  "text-white/90 placeholder:text-white/25",
  "focus:outline-none focus:ring-2 focus:ring-[#e53935]/60 focus:border-[#e53935]/50",
  "transition-all duration-150 disabled:opacity-40",
  "[-webkit-appearance:none]",
].join(" ");

const cls = {
  ok:    `${inputBase} border-white/[0.12] hover:border-white/25 hover:bg-white/[0.10]`,
  err:   `${inputBase} border-red-500/60 bg-red-500/[0.12]`,
  label: "block text-[10px] font-semibold mb-1.5 tracking-[0.1em] uppercase text-white/45",
  field: "mb-4",
  hint:  "mt-1 text-[11px] text-white/28",
  error: "mt-1 text-[11px] text-red-400",
  intro: "text-sm text-white/40 mb-5",
};
// ─────────────────────────────────────────────────────────────────────────────

export default function BookTrialModal() {
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
    window.addEventListener("open-book-trial-modal", open);
    return () => window.removeEventListener("open-book-trial-modal", open);
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
    setTouched({ parentName: true, childName: true, childAge: true, classInterest: true, studio: true, whatsapp: true, email: true });
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStatus("submitting");
    try {
      const res  = await fetch("/api/book-trial", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
      const data = await res.json() as { ok: boolean; message: string };
      if (data.ok) { setStatus("success"); setServerMsg(data.message); }
      else         { setStatus("error");   setServerMsg(data.message ?? "Something went wrong."); }
    } catch {
      setStatus("error");
      setServerMsg("Network error. Please try again.");
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={close} title="Book a Free Trial Class" titleId={`${uid}-title`} maxWidth="560px">
      {status === "success" ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full"
               style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                 strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-green-400">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="text-white/90 font-medium">{serverMsg}</p>
          <p className="text-sm text-white/40">
            We&apos;ll confirm your trial soon. Or reach us on{" "}
            <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="text-green-400 underline">WhatsApp</a>.
          </p>
          <button type="button" onClick={close}
            className="mt-2 px-6 py-2.5 text-sm font-normal text-white rounded-md bg-[#b91c1c] hover:bg-[#991b1b] transition-colors">
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <p className={cls.intro}>
            Fields marked <span className="text-red-400 font-semibold">*</span> are required.
          </p>

          <div className={cls.field}>
            <label htmlFor={`${uid}-parentName`} className={cls.label}>
              Parent / Guardian Name <span className="text-red-400">*</span>
            </label>
            <input id={`${uid}-parentName`} name="parentName" type="text" autoComplete="name"
              value={fields.parentName} onChange={handleChange} onBlur={handleBlur}
              disabled={status === "submitting"} className={errors.parentName ? cls.err : cls.ok}
              placeholder="Full name" />
            {errors.parentName && <p role="alert" className={cls.error}>{errors.parentName}</p>}
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label htmlFor={`${uid}-childName`} className={cls.label}>Child&apos;s Name <span className="text-red-400">*</span></label>
              <input id={`${uid}-childName`} name="childName" type="text"
                value={fields.childName} onChange={handleChange} onBlur={handleBlur}
                disabled={status === "submitting"} className={errors.childName ? cls.err : cls.ok}
                placeholder="Child's full name" />
              {errors.childName && <p role="alert" className={cls.error}>{errors.childName}</p>}
            </div>
            <div style={{ width: "100px" }}>
              <label htmlFor={`${uid}-childAge`} className={cls.label}>Age <span className="text-red-400">*</span></label>
              <input id={`${uid}-childAge`} name="childAge" type="number" min={3} max={16}
                value={fields.childAge} onChange={handleChange} onBlur={handleBlur}
                disabled={status === "submitting"} className={errors.childAge ? cls.err : cls.ok}
                placeholder="3–16" />
              {errors.childAge && <p role="alert" className={cls.error}>{errors.childAge}</p>}
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label htmlFor={`${uid}-classInterest`} className={cls.label}>Class Interest <span className="text-red-400">*</span></label>
              <select id={`${uid}-classInterest`} name="classInterest"
                value={fields.classInterest} onChange={handleChange} onBlur={handleBlur}
                disabled={status === "submitting"} className={`${errors.classInterest ? cls.err : cls.ok} cursor-pointer`}>
                <option value="">— Select class —</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.classInterest && <p role="alert" className={cls.error}>{errors.classInterest}</p>}
            </div>
            <div className="flex-1">
              <label htmlFor={`${uid}-studio`} className={cls.label}>Preferred Studio <span className="text-red-400">*</span></label>
              <select id={`${uid}-studio`} name="studio"
                value={fields.studio} onChange={handleChange} onBlur={handleBlur}
                disabled={status === "submitting"} className={`${errors.studio ? cls.err : cls.ok} cursor-pointer`}>
                <option value="">— Select studio —</option>
                {STUDIOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.studio && <p role="alert" className={cls.error}>{errors.studio}</p>}
            </div>
          </div>

          <div className={cls.field}>
            <label htmlFor={`${uid}-preferredDay`} className={cls.label}>Preferred Day</label>
            <select id={`${uid}-preferredDay`} name="preferredDay"
              value={fields.preferredDay} onChange={handleChange} onBlur={handleBlur}
              disabled={status === "submitting"} className={`${cls.ok} cursor-pointer`}>
              <option value="">— Any day —</option>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label htmlFor={`${uid}-whatsapp`} className={cls.label}>WhatsApp Number <span className="text-red-400">*</span></label>
              <input id={`${uid}-whatsapp`} name="whatsapp" type="tel" autoComplete="tel"
                value={fields.whatsapp} onChange={handleChange} onBlur={handleBlur}
                disabled={status === "submitting"} className={errors.whatsapp ? cls.err : cls.ok}
                placeholder="628xxxxxxxxxx" />
              {errors.whatsapp
                ? <p role="alert" className={cls.error}>{errors.whatsapp}</p>
                : <p className={cls.hint}>No + prefix. E.g. 628xxxxxxxxxx</p>}
            </div>
            <div className="flex-1">
              <label htmlFor={`${uid}-email`} className={cls.label}>Email</label>
              <input id={`${uid}-email`} name="email" type="email" autoComplete="email"
                value={fields.email} onChange={handleChange} onBlur={handleBlur}
                disabled={status === "submitting"} className={errors.email ? cls.err : cls.ok}
                placeholder="you@example.com (optional)" />
              {errors.email && <p role="alert" className={cls.error}>{errors.email}</p>}
            </div>
          </div>

          {status === "error" && serverMsg && (
            <div role="alert"
              className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-md text-sm text-red-300"
              style={{ background: "rgba(220,38,38,0.14)", border: "1px solid rgba(220,38,38,0.28)" }}>
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0v4.5zm.75-7a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
              </svg>
              {serverMsg}
            </div>
          )}

          <button type="submit" disabled={status === "submitting"}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-normal text-white rounded-md bg-[#b91c1c] hover:bg-[#991b1b] active:bg-[#7f1d1d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ fontFamily: "var(--font-archivo-black, sans-serif)" }}>
            {status === "submitting" ? (
              <>
                <svg aria-hidden="true" className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Sending…
              </>
            ) : "Book Free Trial"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}

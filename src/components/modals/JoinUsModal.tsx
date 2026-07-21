"use client";
// src/components/modals/JoinUsModal.tsx
//
// Replicates WPForms 852 / Elementor popup 2266 — Join Us / Registration form.
// Opened via: window.dispatchEvent(new Event("open-join-us-modal"))
// Submits to: POST /api/join-us

import { useEffect, useRef, useCallback, useState, useId } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";

// ── Constants ─────────────────────────────────────────────────────────────────

const CLASSES = [
  "Hip-Hop",
  "Ballet",
  "Singing",
  "K-Pop Dance",
  "Jazz Dance",
  "Drama & Musical Theatre",
  "Modeling",
  "Breakdance",
  "Public Speaking",
] as const;

const STUDIOS = ["Sanur Studio", "Canggu Studio"] as const;

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6282146284464";
const WA_HREF   = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi, I'd like to join Eva Scolaro Talent Studio!")}`;

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormFields {
  parentName:  string;
  childName:   string;
  childAge:    string;
  classes:     string[];   // multi-select
  studio:      string;
  whatsapp:    string;
  email:       string;
  notes:       string;
}

interface FieldErrors {
  parentName?: string;
  childName?:  string;
  childAge?:   string;
  classes?:    string;
  studio?:     string;
  whatsapp?:   string;
  email?:      string;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

const EMPTY: FormFields = {
  parentName: "", childName: "", childAge: "", classes: [],
  studio: "", whatsapp: "", email: "", notes: "",
};

// ── Validation ────────────────────────────────────────────────────────────────

function validate(f: FormFields): FieldErrors {
  const e: FieldErrors = {};
  if (!f.parentName.trim())  e.parentName  = "Parent / Guardian name is required.";
  if (!f.childName.trim())   e.childName   = "Child's name is required.";
  if (!f.childAge.trim()) {
    e.childAge = "Child's age is required.";
  } else {
    const age = parseInt(f.childAge, 10);
    if (isNaN(age) || age < 3 || age > 16) e.childAge = "Age must be between 3 and 16.";
  }
  if (f.classes.length === 0) e.classes = "Please select at least one class.";
  if (!f.studio)              e.studio   = "Please select a studio.";
  if (!f.whatsapp.trim()) {
    e.whatsapp = "WhatsApp number is required.";
  } else if (!/^\d{7,15}$/.test(f.whatsapp.replace(/\s/g, ""))) {
    e.whatsapp = "Enter a valid number without + (e.g. 628xxxxxxxxxx).";
  }
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    e.email = "Enter a valid email address.";
  }
  return e;
}

// ── Shared styles (matching FeedbackModal) ────────────────────────────────────

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

export default function JoinUsModal() {
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
    window.addEventListener("open-join-us-modal", openModal);
    return () => window.removeEventListener("open-join-us-modal", openModal);
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

  // Multi-checkbox for classes
  const handleClassToggle = (cls: string) => {
    const next = fields.classes.includes(cls)
      ? fields.classes.filter(c => c !== cls)
      : [...fields.classes, cls];
    const nextFields = { ...fields, classes: next };
    setFields(nextFields);
    if (touched.classes) setErrors(validate(nextFields));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all required fields as touched
    setTouched({
      parentName: true, childName: true, childAge: true,
      classes: true, studio: true, whatsapp: true, email: true,
    });
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("submitting");
    setServerMsg("");

    try {
      const res  = await fetch("/api/join-us", {
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
        m-auto w-full max-w-[580px] max-h-[90dvh]
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
          Join Us — Registration
        </h2>
        <button
          type="button" onClick={closeModal} aria-label="Close registration form"
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
                We&apos;ll be in touch soon. Or reach us directly on{" "}
                <a href={WA_HREF} target="_blank" rel="noopener noreferrer"
                   className="text-green-600 underline hover:text-green-700">
                  WhatsApp
                </a>.
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
                Fields marked <span aria-hidden="true" className="text-red-600 font-medium">*</span> are required.
              </p>

              {/* Parent / Guardian Name */}
              <div className={cls.field}>
                <label htmlFor={`${uid}-parentName`} className={cls.label}>
                  Parent / Guardian Name <span aria-hidden="true" className="text-red-600">*</span>
                </label>
                <input
                  id={`${uid}-parentName`} name="parentName" type="text" autoComplete="name"
                  value={fields.parentName} onChange={handleChange} onBlur={handleBlur}
                  disabled={status === "submitting"}
                  aria-invalid={!!errors.parentName}
                  aria-describedby={errors.parentName ? `${uid}-parentName-err` : undefined}
                  className={errors.parentName ? cls.error : cls.ok}
                  placeholder="Full name"
                />
                {errors.parentName && (
                  <p id={`${uid}-parentName-err`} role="alert" className="mt-1 text-xs text-red-600">
                    {errors.parentName}
                  </p>
                )}
              </div>

              {/* Child's Name + Age side by side */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label htmlFor={`${uid}-childName`} className={cls.label}>
                    Child&apos;s Name <span aria-hidden="true" className="text-red-600">*</span>
                  </label>
                  <input
                    id={`${uid}-childName`} name="childName" type="text"
                    value={fields.childName} onChange={handleChange} onBlur={handleBlur}
                    disabled={status === "submitting"}
                    aria-invalid={!!errors.childName}
                    aria-describedby={errors.childName ? `${uid}-childName-err` : undefined}
                    className={errors.childName ? cls.error : cls.ok}
                    placeholder="Child's full name"
                  />
                  {errors.childName && (
                    <p id={`${uid}-childName-err`} role="alert" className="mt-1 text-xs text-red-600">
                      {errors.childName}
                    </p>
                  )}
                </div>
                <div style={{ width: "100px" }}>
                  <label htmlFor={`${uid}-childAge`} className={cls.label}>
                    Age <span aria-hidden="true" className="text-red-600">*</span>
                  </label>
                  <input
                    id={`${uid}-childAge`} name="childAge" type="number"
                    min={3} max={16}
                    value={fields.childAge} onChange={handleChange} onBlur={handleBlur}
                    disabled={status === "submitting"}
                    aria-invalid={!!errors.childAge}
                    aria-describedby={errors.childAge ? `${uid}-childAge-err` : undefined}
                    className={errors.childAge ? cls.error : cls.ok}
                    placeholder="3–16"
                  />
                  {errors.childAge && (
                    <p id={`${uid}-childAge-err`} role="alert" className="mt-1 text-xs text-red-600">
                      {errors.childAge}
                    </p>
                  )}
                </div>
              </div>

              {/* Class Interest — checkbox grid */}
              <div className="mb-4">
                <p className={cls.label}>
                  Class Interest <span aria-hidden="true" className="text-red-600">*</span>
                </p>
                <div
                  className="grid gap-x-4 gap-y-2 mt-1"
                  style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
                  role="group"
                  aria-label="Select classes"
                >
                  {CLASSES.map((c) => {
                    const checked = fields.classes.includes(c);
                    return (
                      <label key={c}
                        className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleClassToggle(c)}
                          disabled={status === "submitting"}
                          className="w-4 h-4 accent-[#b91c1c] cursor-pointer"
                        />
                        {c}
                      </label>
                    );
                  })}
                </div>
                {touched.classes && errors.classes && (
                  <p role="alert" className="mt-1 text-xs text-red-600">{errors.classes}</p>
                )}
              </div>

              {/* Preferred Studio */}
              <div className={cls.field}>
                <label htmlFor={`${uid}-studio`} className={cls.label}>
                  Preferred Studio <span aria-hidden="true" className="text-red-600">*</span>
                </label>
                <select
                  id={`${uid}-studio`} name="studio"
                  value={fields.studio} onChange={handleChange} onBlur={handleBlur}
                  disabled={status === "submitting"}
                  aria-invalid={!!errors.studio}
                  aria-describedby={errors.studio ? `${uid}-studio-err` : undefined}
                  className={`${errors.studio ? cls.error : cls.ok} cursor-pointer`}
                >
                  <option value="">— Select studio —</option>
                  {STUDIOS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.studio && (
                  <p id={`${uid}-studio-err`} role="alert" className="mt-1 text-xs text-red-600">
                    {errors.studio}
                  </p>
                )}
              </div>

              {/* WhatsApp + Email side by side */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label htmlFor={`${uid}-whatsapp`} className={cls.label}>
                    WhatsApp Number <span aria-hidden="true" className="text-red-600">*</span>
                  </label>
                  <input
                    id={`${uid}-whatsapp`} name="whatsapp" type="tel" autoComplete="tel"
                    value={fields.whatsapp} onChange={handleChange} onBlur={handleBlur}
                    disabled={status === "submitting"}
                    aria-invalid={!!errors.whatsapp}
                    aria-describedby={errors.whatsapp ? `${uid}-whatsapp-err` : `${uid}-whatsapp-hint`}
                    className={errors.whatsapp ? cls.error : cls.ok}
                    placeholder="628xxxxxxxxxx"
                  />
                  {errors.whatsapp ? (
                    <p id={`${uid}-whatsapp-err`} role="alert" className="mt-1 text-xs text-red-600">
                      {errors.whatsapp}
                    </p>
                  ) : (
                    <p id={`${uid}-whatsapp-hint`} className="mt-1 text-xs text-gray-400">
                      No + prefix. E.g. 628xxxxxxxxxx
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor={`${uid}-email`} className={cls.label}>Email</label>
                  <input
                    id={`${uid}-email`} name="email" type="email" autoComplete="email"
                    value={fields.email} onChange={handleChange} onBlur={handleBlur}
                    disabled={status === "submitting"}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? `${uid}-email-err` : undefined}
                    className={errors.email ? cls.error : cls.ok}
                    placeholder="you@example.com (optional)"
                  />
                  {errors.email && (
                    <p id={`${uid}-email-err`} role="alert" className="mt-1 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              <div className={cls.field}>
                <label htmlFor={`${uid}-notes`} className={cls.label}>Additional Notes</label>
                <textarea
                  id={`${uid}-notes`} name="notes" rows={3}
                  value={fields.notes} onChange={handleChange} onBlur={handleBlur}
                  disabled={status === "submitting"}
                  className={`${cls.ok} resize-y min-h-[72px]`}
                  placeholder="Any additional information you'd like to share…"
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
                ) : "Submit Registration"}
              </button>
            </form>
          )}

        </div>
      </div>
    </dialog>
  );
}

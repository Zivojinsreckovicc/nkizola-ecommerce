"use client";

import { useActionState, useId } from "react";
import {
  submitContactForm,
  type ContactFormState,
} from "@/app/contact/actions";
import { SubmitButton } from "@/components/submit-button";

const initialContactState: ContactFormState = {
  status: "idle",
  message: "",
};

const fieldClass =
  "w-full rounded-lg border border-deep-sea/15 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-sea-blue focus:ring-2 focus:ring-sea-blue/30 focus:outline-none";
const labelClass =
  "block text-sm font-semibold tracking-wide text-deep-sea uppercase";
const errorClass = "mt-1 text-sm text-red-600";

export function ContactForm() {
  const [state, formAction] = useActionState(
    submitContactForm,
    initialContactState
  );
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();
  const errors = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-sea-blue/20 bg-white p-8 text-center shadow-sm"
      >
        <p className="font-display text-2xl tracking-wide text-deep-sea uppercase">
          Message sent
        </p>
        <p className="mt-3 text-ink/75">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {state.message}
        </p>
      )}

      {/* Honeypot — visually hidden, ignored by humans, off the tab order. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor={nameId} className={labelClass}>
          Name
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${nameId}-error` : undefined}
          className={`${fieldClass} mt-2`}
          placeholder="Your name"
        />
        {errors.name && (
          <p id={`${nameId}-error`} className={errorClass}>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={emailId} className={labelClass}>
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${emailId}-error` : undefined}
          className={`${fieldClass} mt-2`}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id={`${emailId}-error`} className={errorClass}>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={subjectId} className={labelClass}>
          Subject <span className="font-normal text-ink/50">(optional)</span>
        </label>
        <input
          id={subjectId}
          name="subject"
          type="text"
          className={`${fieldClass} mt-2`}
          placeholder="Order, sizing, stock…"
        />
      </div>

      <div>
        <label htmlFor={messageId} className={labelClass}>
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${messageId}-error` : undefined}
          className={`${fieldClass} mt-2 resize-y`}
          placeholder="How can we help?"
        />
        {errors.message && (
          <p id={`${messageId}-error`} className={errorClass}>
            {errors.message}
          </p>
        )}
      </div>

      <SubmitButton
        pendingText="Sending…"
        className="w-full rounded-full bg-sun-yellow px-8 py-4 font-display text-lg tracking-wide text-ink uppercase transition-colors hover:bg-sun-yellow/85 sm:w-auto"
      >
        Send message
      </SubmitButton>
    </form>
  );
}

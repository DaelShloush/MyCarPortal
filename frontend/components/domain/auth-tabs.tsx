"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction, registerAction, googleLoginAction } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

interface AuthTabsProps {
  defaultTab?: "login" | "register";
  error?: string;
  notice?: string;
}

export function AuthTabs({ defaultTab = "login", error, notice }: AuthTabsProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [pwError, setPwError] = useState<string | null>(null);

  function validateRegister(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const pw = (form.elements.namedItem("password") as HTMLInputElement)?.value ?? "";
    const confirm =
      (form.elements.namedItem("confirm_password") as HTMLInputElement)?.value ?? "";
    if (pw.length < 8) {
      e.preventDefault();
      setPwError("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }
    if (pw !== confirm) {
      e.preventDefault();
      setPwError("הסיסמאות אינן תואמות");
      return;
    }
    setPwError(null);
  }

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex rounded-xl bg-[var(--color-bg-subtle)] p-1 mb-6">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={cn(
            "flex-1 h-10 rounded-lg text-sm font-bold transition-colors",
            tab === "login"
              ? "bg-white text-[var(--color-primary-700)] shadow-[var(--shadow-sm)]"
              : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
          )}
        >
          התחברות
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={cn(
            "flex-1 h-10 rounded-lg text-sm font-bold transition-colors",
            tab === "register"
              ? "bg-white text-[var(--color-primary-700)] shadow-[var(--shadow-sm)]"
              : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
          )}
        >
          הרשמה
        </button>
      </div>

      <h1 className="text-2xl font-black text-center mb-2">
        {tab === "login" ? "ברוך השב" : "הרשמה ל-MyCarPortal"}
      </h1>
      <p className="text-sm text-center text-[var(--color-text-subtle)] mb-6">
        {tab === "login"
          ? "התחבר כדי לנהל את הרכבים שלך"
          : "חינם · ללא כרטיס אשראי · בפחות מדקה"}
      </p>

      {notice && (
        <p className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 text-center">
          {notice}
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-lg bg-[var(--color-risk-high-bg)] border border-[var(--color-risk-high-border)] text-[var(--color-risk-high-text)] text-sm px-4 py-3 text-center">
          {decodeURIComponent(error)}
        </p>
      )}

      {/* Google */}
      <form action={googleLoginAction}>
        <button
          type="submit"
          className="w-full h-11 flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-white hover:bg-[var(--color-gray-50)] font-medium text-sm transition-colors"
        >
          <span className="text-lg font-bold text-[#4285F4]">G</span>
          {tab === "login" ? "התחבר עם Google" : "הירשם עם Google"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="text-xs text-[var(--color-text-subtle)]">או</span>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      {/* Login form */}
      {tab === "login" ? (
        <form action={loginAction} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">אימייל</label>
            <Input type="email" name="email" placeholder="dael@example.com" required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium">סיסמה</label>
              <Link href="/forgot-password" className="text-xs text-[var(--color-primary-500)] hover:underline">
                שכחתי סיסמה
              </Link>
            </div>
            <Input type="password" name="password" placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full" size="lg">
            התחברות
          </Button>
          <p className="text-sm text-center text-[var(--color-text-subtle)]">
            אין לך חשבון?{" "}
            <button
              type="button"
              onClick={() => setTab("register")}
              className="text-[var(--color-primary-500)] font-medium hover:underline"
            >
              הרשמה חינם
            </button>
          </p>
        </form>
      ) : (
        /* Register form */
        <form action={registerAction} onSubmit={validateRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">שם מלא</label>
            <Input name="name" placeholder="מאיר כהן" required />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">אימייל</label>
            <Input type="email" name="email" placeholder="dael@example.com" required />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">סיסמה</label>
            <Input
              type="password"
              name="password"
              placeholder="לפחות 8 תווים"
              minLength={8}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">אימות סיסמה</label>
            <Input
              type="password"
              name="confirm_password"
              placeholder="הקלד שוב את הסיסמה"
              minLength={8}
              required
            />
          </div>
          {pwError && (
            <p className="text-xs text-[var(--color-danger)]" role="alert">
              {pwError}
            </p>
          )}
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" required />
            <span className="text-[var(--color-text-muted)]">
              אני מאשר/ת את{" "}
              <Link href="/terms" className="text-[var(--color-primary-500)] underline">
                תנאי השימוש
              </Link>{" "}
              ו
              <Link href="/privacy" className="text-[var(--color-primary-500)] underline">
                מדיניות הפרטיות
              </Link>
            </span>
          </label>
          <Button type="submit" className="w-full" size="lg">
            הירשם חינם
          </Button>
          <p className="text-sm text-center text-[var(--color-text-subtle)]">
            כבר יש לך חשבון?{" "}
            <button
              type="button"
              onClick={() => setTab("login")}
              className="text-[var(--color-primary-500)] font-medium hover:underline"
            >
              התחבר
            </button>
          </p>
        </form>
      )}
    </div>
  );
}

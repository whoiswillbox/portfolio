"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UnlockPage() {
  return (
    <React.Suspense fallback={null}>
      <UnlockForm />
    </React.Suspense>
  );
}

function UnlockForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || submitting) return;
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(true);
        setSubmitting(false);
        return;
      }
      const next = params.get("next") || "/";
      router.replace(next);
      router.refresh();
    } catch {
      setError(true);
      setSubmitting(false);
    }
  };

  return (
    <div
      className="flex h-dvh w-full flex-col items-center justify-center bg-sidebar p-6"
      style={{
        backgroundImage:
          "radial-gradient(color-mix(in oklch, var(--muted-foreground) 12%, transparent) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      <form
        onSubmit={submit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl border bg-background p-6 shadow-sm"
      >
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Box className="size-5" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-h4 font-semibold tracking-tight">This site is private</h1>
          <p className="text-body-sm text-muted-foreground">
            Enter the password to continue.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            aria-label="Password"
            autoFocus
            className="text-body-sm"
          />
          {error && (
            <p className="text-body-xs text-critical">Incorrect password. Try again.</p>
          )}
        </div>
        <Button type="submit" disabled={!password.trim() || submitting} className="w-full">
          <Lock className="size-4" />
          {submitting ? "Unlocking…" : "Enter"}
        </Button>
      </form>
    </div>
  );
}

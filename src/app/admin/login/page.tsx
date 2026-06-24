"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={null}>
      <AdminLoginForm />
    </React.Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [key, setKey] = React.useState("");
  const [error, setError] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || submitting) return;
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: key.trim() }),
      });
      if (!res.ok) {
        setError(true);
        setSubmitting(false);
        return;
      }
      router.replace(params.get("next") || "/admin/chat");
      router.refresh();
    } catch {
      setError(true);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center bg-sidebar p-6">
      <form
        onSubmit={submit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl border bg-background p-6 shadow-sm"
      >
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldCheckIcon className="size-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-h4 font-semibold tracking-tight">Admin access</h1>
          <p className="text-body-sm text-muted-foreground">Enter your admin key.</p>
        </div>
        <Input
          type="password"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setError(false);
          }}
          placeholder="Admin key"
          aria-label="Admin key"
          autoFocus
          // Prevent mobile Safari from mangling the key (capitalizing the first
          // letter, autocorrecting, or inserting smart punctuation/spaces).
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          className="text-body-sm"
        />
        {error && <p className="text-body-xs text-critical">Incorrect key. Try again.</p>}
        <Button type="submit" disabled={!key.trim() || submitting} className="w-full">
          {submitting ? "Verifying…" : "Enter"}
        </Button>
      </form>
    </div>
  );
}

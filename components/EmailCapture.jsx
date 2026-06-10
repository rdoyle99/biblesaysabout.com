"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

export default function EmailCapture({ source = "biblesays" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="border-t bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-2">
          A verse for your week, every week
        </h2>
        <p className="text-muted-foreground mb-5">
          One encouraging passage and our newest topics — free, no spam.
        </p>
        {status === "done" ? (
          <p className="flex items-center justify-center gap-2 font-medium text-green-600">
            <Check className="w-4 h-4" />
            You&apos;re in — see you this week.
          </p>
        ) : (
          <form
            onSubmit={submit}
            className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Joining…" : "Subscribe"}
            </Button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-2 text-sm text-red-500">
            Something went wrong — try again.
          </p>
        )}
      </div>
    </div>
  );
}

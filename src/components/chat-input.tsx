"use client";

import * as React from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

/**
 * Chat composer. Pass `attachedSection` to dock content (e.g. an alert/banner)
 * to the top: it renders in a banner-colored shell with the input nested below
 * as its own rounded-top card, so the input's top corners show against the
 * banner with no gap. Without it, the input is a single rounded card.
 */
export function ChatInput({
  value,
  onValueChange,
  onSend,
  placeholder = "Ask a question…",
  ariaLabel = "Ask a question",
  disabled = false,
  sending = false,
  attachedSection,
  footerLeft,
}: {
  value: string;
  onValueChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  sending?: boolean;
  attachedSection?: React.ReactNode;
  footerLeft?: React.ReactNode;
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-grow the textarea up to a max height as the visitor types.
  const resize = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);
  React.useEffect(() => { resize(); }, [value, resize]);
  React.useLayoutEffect(() => {
    resize();
    const id = requestAnimationFrame(resize);
    return () => cancelAnimationFrame(id);
  }, [resize]);
  React.useEffect(() => {
    window.addEventListener("boxai:opened", resize);
    return () => window.removeEventListener("boxai:opened", resize);
  }, [resize]);

  // Keep the attached section mounted through its collapse animation. When the
  // parent clears `attachedSection`, we hold onto the last content and animate
  // the grid row from 1fr → 0fr, then unmount once the transition finishes.
  const [renderedSection, setRenderedSection] = React.useState(attachedSection);
  const open = Boolean(attachedSection);
  React.useEffect(() => {
    if (attachedSection) setRenderedSection(attachedSection);
  }, [attachedSection]);

  const body = (
    <div className="flex flex-col gap-2 p-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        rows={1}
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
        className="max-h-40 w-full resize-none bg-transparent px-2 py-1.5 text-body-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
        style={{ minHeight: 0 }}
      />
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 pl-1">{footerLeft}</div>
        <Button
          type="submit"
          size="icon"
          className="size-8 rounded-full"
          disabled={!value.trim() || sending || disabled}
          aria-label="Send"
        >
          <PaperAirplaneIcon className="size-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      {renderedSection ? (
        <div
          className={`rounded-3xl shadow-md transition-[background-color,box-shadow] duration-300 hover:shadow-lg ${
            open
              ? "bg-[var(--neutral-100)] dark:bg-[var(--neutral-800)]"
              : "bg-transparent"
          }`}
        >
          {/* grid-rows 1fr → 0fr gives a smooth height collapse on dismiss. */}
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
            onTransitionEnd={() => {
              if (!open) setRenderedSection(null);
            }}
          >
            <div className="overflow-hidden">
              <div className="p-3">{renderedSection}</div>
            </div>
          </div>
          <div className="rounded-3xl border border-black/10 dark:border-white/15 bg-background transition-colors focus-within:border-ring">
            {body}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-black/10 dark:border-white/15 bg-background shadow-md transition-[box-shadow,border-color] hover:shadow-lg focus-within:border-ring">
          {body}
        </div>
      )}
    </form>
  );
}

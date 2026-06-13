"use client";

import * as React from "react";
import { Bot, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { answerFor } from "@/lib/chat/match";
import {
  greeting,
  qaEntries,
  suggestedQuestionIds,
} from "@/lib/chat/repository";

type Message = { id: number; role: "user" | "bot"; text: string };

const suggestions = suggestedQuestionIds
  .map((id) => qaEntries.find((e) => e.id === id))
  .filter((e): e is NonNullable<typeof e> => Boolean(e));

export function ChatPanel() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const nextId = React.useRef(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: nextId.current++, role: "user", text: trimmed };
    const botMsg: Message = { id: nextId.current++, role: "bot", text: answerFor(trimmed) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <aside className="hidden w-80 shrink-0 flex-col border-l bg-sidebar lg:flex">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-fill-brand text-on-fill">
            <Bot className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <p className="text-body-sm font-semibold">Ask about Will</p>
          <p className="text-body-xs text-muted-foreground">Answers from a curated Q&amp;A</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 p-4">
          <BotBubble text={greeting} />

          {messages.length === 0 && (
            <div className="mt-1 flex flex-col gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => send(s.question)}
                  className="rounded-lg border bg-background px-3 py-2 text-left text-body-sm transition-colors hover:bg-surface-brand hover:text-brand"
                >
                  {s.question}
                </button>
              ))}
            </div>
          )}

          {messages.map((m) =>
            m.role === "bot" ? (
              <BotBubble key={m.id} text={m.text} />
            ) : (
              <div
                key={m.id}
                className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-primary px-3 py-2 text-body-sm text-primary-foreground"
              >
                {m.text}
              </div>
            )
          )}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t p-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          aria-label="Ask a question about Will"
          className="text-body-sm"
        />
        <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send">
          <Send className="size-4" />
        </Button>
      </form>
    </aside>
  );
}

function BotBubble({ text }: { text: string }) {
  return (
    <div
      className={cn(
        "max-w-[85%] rounded-lg rounded-bl-sm bg-muted px-3 py-2 text-body-sm text-foreground"
      )}
    >
      {text}
    </div>
  );
}

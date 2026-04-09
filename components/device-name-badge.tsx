"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X, Tag } from "lucide-react";
import { getNickname, setNickname } from "@/lib/terra/device-names";

interface DeviceNameBadgeProps {
  userId: string;
  provider: string;
  /** Called after a save so the parent can re-render with the new label */
  onSave?: (nickname: string) => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

export default function DeviceNameBadge({
  userId,
  provider,
  onSave,
  size = "md",
}: DeviceNameBadgeProps) {
  const [nickname, setLocalNickname] = useState<string>(() => getNickname(userId) ?? "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync whenever userId changes (navigating between devices)
  useEffect(() => {
    setLocalNickname(getNickname(userId) ?? "");
    setEditing(false);
  }, [userId]);

  // Focus input when editing begins
  useEffect(() => {
    if (editing) {
      setDraft(nickname);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [editing, nickname]);

  const displayLabel = nickname || provider;

  const sizeClasses = {
    sm: { text: "text-sm", icon: "h-3 w-3", padding: "px-2 py-0.5", input: "text-sm h-7 w-32" },
    md: { text: "text-base", icon: "h-4 w-4", padding: "px-3 py-1", input: "text-base h-8 w-44" },
    lg: { text: "text-lg", icon: "h-5 w-5", padding: "px-4 py-1.5", input: "text-lg h-10 w-56" },
  }[size];

  const handleSave = () => {
    const trimmed = draft.trim();
    setNickname(userId, trimmed);
    setLocalNickname(trimmed);
    setEditing(false);
    setSaved(true);
    onSave?.(trimmed || provider);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setEditing(false);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5 group animate-in fade-in slide-in-from-left-2 duration-200">
        <Tag className={`${sizeClasses.icon} text-primary shrink-0`} />
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={provider}
          maxLength={32}
          className={`
            ${sizeClasses.input} ${sizeClasses.text}
            rounded-md border border-primary/40 bg-background
            px-2 font-semibold text-foreground outline-none
            ring-2 ring-primary/20 ring-offset-1
            placeholder:text-muted-foreground/50
            transition-all duration-200
          `}
        />
        <button
          onClick={handleSave}
          title="Save name"
          className="flex items-center justify-center h-7 w-7 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 hover:scale-105 active:scale-95"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleCancel}
          title="Cancel"
          className="flex items-center justify-center h-7 w-7 rounded-md bg-muted text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all duration-150 hover:scale-105 active:scale-95"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className={`${sizeClasses.text} font-bold text-foreground`}>
        {displayLabel}
      </span>

      {/* Custom nick indicator */}
      {nickname && (
        <span className={`
          inline-flex items-center gap-1 rounded-full
          bg-primary/10 text-primary border border-primary/20
          ${sizeClasses.padding} text-xs font-semibold tracking-wide
        `}>
          <Tag className="h-2.5 w-2.5" />
          Custom Name
        </span>
      )}

      {/* Saved flash */}
      {saved && (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-2 py-0.5 text-xs font-semibold animate-in fade-in duration-150">
          <Check className="h-2.5 w-2.5" />
          Saved
        </span>
      )}

      {/* Edit button */}
      <button
        onClick={() => setEditing(true)}
        title="Rename this device"
        className={`
          opacity-0 group-hover:opacity-100 transition-all duration-150
          flex items-center justify-center h-6 w-6 rounded-md
          bg-muted/80 hover:bg-primary/10 text-muted-foreground hover:text-primary
          border border-border hover:border-primary/30
          hover:scale-110 active:scale-95
        `}
      >
        <Pencil className="h-3 w-3" />
      </button>
    </div>
  );
}

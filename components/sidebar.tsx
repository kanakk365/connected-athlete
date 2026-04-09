"use client";

import {
  Home,
  User,
  FileText,
  ComponentIcon as ImageIconComponent,
  Activity,
  Menu,
  Settings,
  HelpCircle,
  Smartphone,
  Plus,
  X,
  Loader2,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import type { LucideIcon } from "lucide-react";

interface ConnectedDevice {
  userId: string;
  provider: string;
  active: boolean;
  referenceId?: string;
}

/** Strip the timestamp suffix we append: "Apple Alpha__1712345678" → "Apple Alpha" */
function getLabel(device: ConnectedDevice): string {
  if (device.referenceId) {
    const clean = device.referenceId.replace(/__\d+$/, "").trim();
    if (clean && clean !== "device") return clean;
  }
  return device.provider;
}

// ---------------------------------------------------------------------------
// Connect Device Modal
// ---------------------------------------------------------------------------
function ConnectDeviceModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [deviceName, setDeviceName] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  async function connect() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/terra/generate-widget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference_id: deviceName.trim() || "device",
        }),
      });
      if (!res.ok) throw new Error("Failed to generate widget session");
      const { url } = await res.json();
      if (url) window.location.assign(url);
    } catch (err) {
      console.error(err);
      setLoading(false);
      onClose();
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") connect();
    if (e.key === "Escape") onClose();
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Dialog */}
      <div className="relative w-full max-w-sm mx-4 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
              <Smartphone className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              Connect a Device
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="device-name"
              className="text-sm font-medium text-foreground"
            >
              Device Name
            </label>
            <p className="text-xs text-muted-foreground">
              Give this device a unique name so you can tell it apart from
              others of the same type.
            </p>
          </div>

          <input
            ref={inputRef}
            id="device-name"
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="e.g. Apple Alpha, Fitbit Pro…"
            maxLength={32}
            disabled={loading}
            className="w-full text-sm px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
          />

          <p className="text-[10px] text-muted-foreground/60">
            This name is stored permanently against the connection — not just
            your browser.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 text-sm py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={connect}
            disabled={loading}
            className="flex-1 text-sm py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Connecting…
              </>
            ) : (
              "Connect →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DeviceRow — read-only, shows Terra label; no localStorage rename
// ---------------------------------------------------------------------------
function DeviceRow({ device }: { device: ConnectedDevice }) {
  const label = getLabel(device);
  const isNamed = !!(device.referenceId?.replace(/__\d+$/, "").trim()) &&
    device.referenceId?.replace(/__\d+$/, "").trim() !== "device";

  return (
    <Link
      href={`/dashboard/device/${device.userId}`}
      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
    >
      <Smartphone className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate min-w-0">
        {label}
        {isNamed && (
          <span className="ml-1.5 text-[9px] font-bold text-primary/50">✦</span>
        )}
      </span>
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          device.active ? "bg-green-500" : "bg-red-400"
        }`}
      />
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchDevices = useCallback(async () => {
    try {
      const res = await fetch("/api/terra/users");
      const data = await res.json();
      const users = data.users || [];
      setDevices(
        users.map(
          (u: {
            user_id: string;
            provider: string;
            active: boolean;
            reference_id?: string;
          }) => ({
            userId: u.user_id,
            provider: u.provider,
            active: u.active,
            referenceId: u.reference_id,
          })
        )
      );
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: LucideIcon;
    children: React.ReactNode;
  }) {
    return (
      <Link
        href={href}
        onClick={() => setIsMobileMenuOpen(false)}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
      >
        <Icon className="h-4 w-4 mr-3 shrink-0" />
        {children}
      </Link>
    );
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-background shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Sidebar nav */}
      <nav
        className={`
          fixed inset-y-0 left-0 z-[70] w-64 bg-background transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:w-64 border-r border-border
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          <Link
            href="/dashboard"
            className="h-16 px-6 flex items-center border-b border-border"
          >
            <span className="text-lg font-semibold text-foreground">
              Connected Athletes
            </span>
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-1">
              <NavItem href="/dashboard" icon={Home}>Dashboard</NavItem>
              <NavItem href="/profile" icon={User}>Profile</NavItem>
              <NavItem href="/documents" icon={FileText}>Documents</NavItem>
              <NavItem href="/gallery" icon={ImageIconComponent}>Gallery</NavItem>
              <NavItem href="/sensors" icon={Activity}>Sensors</NavItem>
            </div>

            {/* Connected Devices */}
            <div className="mt-6">
              <div className="px-3 flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Connected Devices
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  title="Connect a new device"
                  className="p-1 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-0.5">
                {devices.map((d) => (
                  <DeviceRow key={d.userId} device={d} />
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-border">
            <div className="space-y-1">
              <NavItem href="/dashboard" icon={Settings}>Settings</NavItem>
              <NavItem href="/dashboard" icon={HelpCircle}>Help</NavItem>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Connect Device Modal */}
      {showModal && (
        <ConnectDeviceModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

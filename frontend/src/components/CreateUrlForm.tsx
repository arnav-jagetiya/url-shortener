import React, { useState } from "react";
import { urlService } from "../services/urls";
import type { UrlResponse } from "../types/url";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

interface CreateUrlFormProps {
  onUrlCreated: (url: UrlResponse) => void;
}

export const CreateUrlForm: React.FC<CreateUrlFormProps> = ({ onUrlCreated }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // Instant Validation using browser native URL constructor
  const urlError = (() => {
    if (!originalUrl) return null;
    try {
      new URL(originalUrl);
      return null;
    } catch {
      return "URL must be absolute (e.g. https://google.com)";
    }
  })();

  // Instant Custom Alias Validation
  const aliasError = (() => {
    if (!customAlias) return null;
    const trimmed = customAlias.trim();
    if (trimmed.length < 3 || trimmed.length > 30) {
      return "Alias must be between 3 and 30 characters";
    }
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(trimmed)) {
      return "Alias can only contain letters, numbers, hyphens, and underscores";
    }
    return null;
  })();

  // Expiration date human-readable formatter
  const formatExpirationDisplay = (dateString: string): string | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  };

  // Convert current Date to local YYYY-MM-DDTHH:MM format safely
  const getLocalDatetimeString = (date: Date): string => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  // Programmatically open date-time picker popover on click
  const handlePickerClick = (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      e.currentTarget.showPicker();
    } catch {
      // Browser fallback (native click behavior is preserved)
    }
  };

  // Isolate expirationMinutes calculation as a temporary backend compatibility layer
  const calculateExpirationMinutes = (dateString: string): number | undefined => {
    if (!dateString) return undefined;
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    const diffMs = selectedDate.getTime() - currentDate.getTime();
    
    // Return at least 1 minute if difference is positive, otherwise undefined or invalid
    const minutes = Math.floor(diffMs / 60000);
    return minutes > 0 ? minutes : 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Final validation checks before submitting
    try {
      new URL(originalUrl);
    } catch {
      showToast("Invalid URL format. Please correct inputs.", "error");
      return;
    }

    if (aliasError) {
      showToast("Invalid custom alias. Please correct inputs.", "error");
      return;
    }

    setSubmitting(true);
    const expirationMinutes = calculateExpirationMinutes(expirationDate);

    try {
      const created = await urlService.createUrl({
        originalUrl,
        customAlias: customAlias.trim() || undefined,
        expirationMinutes,
      });

      showToast("URL successfully shortened!", "success");
      onUrlCreated(created);

      // Reset form states
      setOriginalUrl("");
      setCustomAlias("");
      setExpirationDate("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data) {
          if (typeof data === "object" && !data.message) {
            setFieldErrors(data as Record<string, string>);
            showToast("Failed to create short URL due to validation errors.", "error");
          } else if (data.message) {
            showToast(data.message, "error");
          } else {
            showToast("Failed to create short URL.", "error");
          }
        } else {
          showToast("Failed to connect to shortener API.", "error");
        }
      } else {
        showToast("An unexpected error occurred.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-6 backdrop-blur-xl shadow-lg">
      <h3 className="text-base font-bold text-white mb-4">Shorten a new link</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Destination URL (full width on desktop) */}
        <div>
          <label htmlFor="long-url" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Destination URL
          </label>
          <input
            id="long-url"
            type="text"
            required
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com/very/long/destination/path"
            className={`w-full rounded-xl border bg-slate-950/80 px-4 py-3.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:ring-1 transition-colors ${
              urlError 
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500" 
                : originalUrl 
                  ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-550" 
                  : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {urlError && (
            <span className="text-[11px] text-red-400 mt-1.5 block">{urlError}</span>
          )}
          {fieldErrors.originalUrl && (
            <span className="text-[11px] text-red-400 mt-1.5 block">{fieldErrors.originalUrl}</span>
          )}
        </div>

        {/* Row 2: Custom Alias, Expiration Date, and Shorten Button in a 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Custom Alias */}
          <div>
            <label htmlFor="custom-alias" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Custom Alias (Optional)
            </label>
            <div className="flex items-center gap-1.5 bg-slate-950/80 rounded-xl border border-slate-800 px-4 py-3 text-xs">
              <span className="text-slate-500 shrink-0 font-medium select-none">shortify.local/</span>
              <input
                id="custom-alias"
                type="text"
                placeholder="summer-promo"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="w-full bg-transparent text-white focus:outline-none placeholder-slate-650"
              />
            </div>
            {aliasError && (
              <span className="text-[11px] text-red-400 mt-1.5 block">{aliasError}</span>
            )}
            {fieldErrors.customAlias && (
              <span className="text-[11px] text-red-400 mt-1.5 block">{fieldErrors.customAlias}</span>
            )}
          </div>

          {/* Expiration Date picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="expiration-date" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Expiration Date (Optional)
              </label>
            </div>
            <input
              id="expiration-date"
              type="datetime-local"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              onClick={handlePickerClick}
              min={getLocalDatetimeString(new Date())}
              className="cursor-pointer w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-350 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {expirationDate ? (
              <span className="text-[11px] text-indigo-400 mt-1.5 block truncate" title={formatExpirationDisplay(expirationDate) || ""}>
                Expires: {formatExpirationDisplay(expirationDate)}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 mt-1.5 block">
                Select the local date and time when this link should expire.
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer w-full rounded-xl bg-indigo-650 hover:bg-indigo-650/90 text-white font-semibold text-xs py-3.5 shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all h-[42px]"
            >
              {submitting ? "Shortening URL..." : "Create URL"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateUrlForm;

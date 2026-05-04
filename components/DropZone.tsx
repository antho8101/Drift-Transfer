"use client";

import { RiUploadCloud2Line } from "@remixicon/react";
import { useRef, useState } from "react";
import { useTranslations } from "@/components/LanguageProvider";

type DropZoneProps = {
  disabled?: boolean;
  helperText?: string;
  selectedFileName?: string;
  onFilesSelected: (files: File[]) => void;
};

export function DropZone({
  disabled = false,
  helperText,
  selectedFileName,
  onFilesSelected
}: DropZoneProps) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function acceptFiles(fileList?: FileList | File[]) {
    const files = Array.from(fileList ?? []);

    if (!files.length || disabled) {
      return;
    }

    onFilesSelected(files);
  }

  return (
    <div
      className={`group rounded-[1.75rem] border border-dashed p-8 text-center transition duration-300 ${
        isDragging
          ? "border-driftBlue bg-sky-300/10"
          : "border-white/15 bg-white/[0.035]"
      } ${disabled ? "opacity-55" : "hover:border-driftBlue/60 hover:bg-white/[0.055]"}`}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragEnter={(event) => {
        event.preventDefault();
        if (disabled) {
          return;
        }
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        acceptFiles(event.dataTransfer.files);
      }}
      onKeyDown={(event) => {
        if (!disabled && (event.key === "Enter" || event.key === " ")) {
          inputRef.current?.click();
        }
      }}
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <input
        className="hidden"
        disabled={disabled}
        multiple
        onChange={(event) => acceptFiles(event.target.files ?? undefined)}
        ref={inputRef}
        type="file"
      />
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-driftBlue/20 to-driftViolet/20 p-3 shadow-inner shadow-white/5 transition duration-300 group-hover:scale-105">
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-driftBlue to-driftViolet opacity-90">
          <RiUploadCloud2Line aria-hidden className="h-[26px] w-[26px] text-white" />
        </div>
      </div>
      <p className="text-lg font-medium text-white">
        {selectedFileName || (isDragging ? t.drop.drag : t.drop.idle)}
      </p>
      <p className="mt-2 text-sm text-mist">
        {helperText ??
          (disabled
            ? t.drop.waiting
            : t.drop.helper)}
      </p>
      <button
        className="magic-button mt-6 rounded-full border border-white/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          inputRef.current?.click();
        }}
        type="button"
      >
        {t.drop.choose}
      </button>
    </div>
  );
}

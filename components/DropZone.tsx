"use client";

import { useRef, useState } from "react";

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
      <div className="mx-auto mb-5 h-16 w-16 rounded-3xl bg-gradient-to-br from-driftBlue/20 to-driftViolet/20 p-4 shadow-inner shadow-white/5 transition duration-300 group-hover:scale-105">
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-driftBlue to-driftViolet opacity-80" />
      </div>
      <p className="text-lg font-medium text-white">
        {selectedFileName || (isDragging ? "Drop to drift" : "Drop your files here")}
      </p>
      <p className="mt-2 text-sm text-mist">
        {helperText ??
          (disabled
            ? "Waiting for the other device."
            : "Drop files or click to choose.")}
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
        Choose files
      </button>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { Edit } from "lucide-react";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  isMultiline?: boolean;
  className?: string;
  editClassName?: string;
  displayClassName?: string;
  maxLength?: number;
}

export function InlineEdit({
  value,
  onSave,
  placeholder = "Click to edit",
  isMultiline = false,
  className = "",
  editClassName = "",
  displayClassName = "",
  maxLength,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (isMultiline) {
        // For textarea, select all text
        inputRef.current.select();
      } else {
        // For input, set cursor at end
        inputRef.current.setSelectionRange(
          inputRef.current.value.length,
          inputRef.current.value.length,
        );
      }
    }
  }, [isEditing, isMultiline]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };
  const handleSave = async () => {
    if (editValue.trim() === value.trim()) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save:", error);
      // Reset to original value on error
      setEditValue(value);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isMultiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Enter" && e.ctrlKey && isMultiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };
  if (isEditing) {
    const InputComponent = isMultiline ? "textarea" : "input";

    return (
      <div className={className}>
        <InputComponent
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={inputRef as any}
          type={isMultiline ? undefined : "text"}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          maxLength={maxLength}
          className={`w-full ${
            isMultiline
              ? "textarea-bordered textarea resize-none"
              : "input-bordered input"
          } ${editClassName}`}
          rows={isMultiline ? 3 : undefined}
          disabled={isLoading}
        />{" "}
        {isMultiline && (
          <div className="mt-1 text-xs text-base-content/60">
            Press Enter to add new lines, Ctrl+Enter or click outside to save,
            Esc to cancel
          </div>
        )}
        {isLoading && (
          <div className="mt-1 flex items-center gap-2 text-sm text-base-content/60">
            <span className="loading loading-xs loading-spinner"></span>
            Saving...
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`group relative flex cursor-pointer items-center gap-4 ${className}`}
      onClick={handleEdit}
    >
      <div
        className={`${displayClassName} ${!value ? "text-base-content/50" : ""}`}
      >
        {value || placeholder}
      </div>
      <div className="opacity-0 transition-opacity group-hover:opacity-100">
        <Edit className="size-4 text-base-content/60" />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Tote } from "../database/queries"; // Assuming Tote type is exported from queries

export interface ToteFormData {
  tote_name: string;
  tote_description: string;
}

interface ToteFormProps {
  initialData?: Partial<Tote>;
  onSubmit: (data: ToteFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export function ToteForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = "Save Tote",
}: ToteFormProps) {
  const [formData, setFormData] = useState<ToteFormData>({
    tote_name: "",
    tote_description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        tote_name: initialData.tote_name || "",
        tote_description: initialData.tote_description || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card space-y-6 bg-base-200 p-4 shadow-xl"
    >
      <div className="form-control">
        <label htmlFor="tote_name" className="label">
          <span className="label-text">Tote Name</span>
        </label>
        <input
          type="text"
          id="tote_name"
          name="tote_name"
          value={formData.tote_name}
          onChange={handleChange}
          className="input-bordered input w-full"
          required
        />
      </div>

      <div className="form-control">
        <label htmlFor="tote_description" className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          id="tote_description"
          name="tote_description"
          value={formData.tote_description}
          onChange={handleChange}
          className="textarea-bordered textarea h-32 w-full"
        />
      </div>

      <div className="card-actions justify-end">
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? <span className="loading loading-spinner"></span> : null}
          {submitButtonText}
        </button>
      </div>
    </form>
  );
}

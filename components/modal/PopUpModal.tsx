import React, { ChangeEvent, FormEvent } from 'react';

interface Program {
  id: string;
  name: string;
  description: string;
  requirements: string;
}

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (programId: string) => void;
}

export default function PopupModal({
  isOpen,
  onClose,
  program,
  onFileUpload,
  handleSubmit
}: PopupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6">
        <button
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="mb-4 text-xl font-semibold">{program.name}</h3>
        <p className="mb-2">Deskripsi: {program.description}</p>
        <p className="mb-4">Syarat: {program.requirements}</p>
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            handleSubmit(program.id);
          }}
        >
          <label className="mb-2 block">
            Upload File:
            <input
              type="file"
              className="mt-1 block w-full rounded border"
              onChange={onFileUpload}
            />
          </label>
          <button
            type="submit"
            className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

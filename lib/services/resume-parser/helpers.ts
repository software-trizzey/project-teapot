import { ALLOWED_EXTENSIONS, ALLOWED_TYPES, MAX_FILE_SIZE_BYTES } from "./constants";

export const getPrettyFileSize = (bytes: number) => {
  const mb = bytes / (1024 * 1024);
  return `${mb % 1 === 0 ? mb : mb.toFixed(2)}MB`;
};

export const validateResumeFile = (file: File): string | null => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
    return "Only .pdf or .docx files are supported.";
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return "Unsupported file type provided.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File must be ${getPrettyFileSize(MAX_FILE_SIZE_BYTES)} or smaller.`;
  }

  return null;
};

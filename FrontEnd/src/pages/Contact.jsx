import React from "react";
import { useUploadSoundFileMutation } from "@/app/services/questionApi";
export default function Contact() {
  const [uploadSoundFile, { isLoading }] = useUploadSoundFileMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await uploadSoundFile(formData);
  };
  return (
    <div>
      <h1>Upload Sound File</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" name="soundFile" accept="audio/*" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

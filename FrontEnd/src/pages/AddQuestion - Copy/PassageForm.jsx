import React, { useEffect, useCallback, useState } from "react";
import FormField from "./FormField";
import { FaTrash } from "react-icons/fa";

export default function PassageForm({
  passageType,
  register,
  errors,
  setValue,
  audioPreviewUrl,
  setAudioPreviewUrl,
  uploadProgress,
  trigger, // Add this prop
}) {
  const [selectedFileName, setSelectedFileName] = useState(null);

  const handleFile = useCallback(
    (file) => {
      if (file && file.type.startsWith("audio/")) {
        console.log("File being set:", file);
        setValue("data.passage.soundFile", file, { shouldValidate: true });
        setAudioPreviewUrl(URL.createObjectURL(file));
        setSelectedFileName(file.name); // Add this line
      }
    },
    [setValue, setAudioPreviewUrl]
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file);
      console.log("File type:", file.type);
      console.log("File size:", file.size);
      handleFile(file);
    }
  };

  const handleDeleteAudio = () => {
    setValue("data.passage.soundFile", null, { shouldValidate: true });
    setAudioPreviewUrl(null);
    setSelectedFileName(null); // Add this line
    const fileInput = document.getElementById("soundFile");
    if (fileInput) {
      fileInput.value = "";
    }
    // Trigger form validation
    trigger("data.passage.soundFile");
  };

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
    };
  }, [audioPreviewUrl]);

  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        id="data.passage.title"
        register={register}
        errors={errors}
      />
      {errors?.title && <p className="text-red-500">{errors.title.message}</p>}

      <FormField
        label="Text"
        id="data.passage.text"
        type="textarea"
        register={register}
        errors={errors}
      />
      {errors?.text && <p className="text-red-500">{errors.text.message}</p>}
      {passageType === "listening" && (
        <div className="flex items-center space-x-4">
          <input
            id="soundFile"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block  text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              dark:file:bg-gray-700 dark:file:text-gray-300
              dark:hover:file:bg-gray-600"
          />

          {errors?.soundFile && (
            <p className="text-red-500">{errors.soundFile.message}</p>
          )}

          {audioPreviewUrl && (
            <div className="flex-shrink-0 flex gap-3 items-center justify-center">
              <audio controls src={audioPreviewUrl} className="w-64 h-10">
                Your browser does not support the audio element.
              </audio>
              <button
                type="button"
                onClick={handleDeleteAudio}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
              >
                <FaTrash className="mr-2" />
                Delete Audio
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add progress bar */}
      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <FormField
        label="URL (optional)"
        id="data.passage.url"
        type="url"
        register={register}
        errors={errors}
        required={false}
      />
      {errors?.url && <p className="text-red-500">{errors.url.message}</p>}
    </div>
  );
}

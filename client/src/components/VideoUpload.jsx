import { useState, useCallback, useRef, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import { Loader2, Copy, Check } from "lucide-react";

function VideoUpload() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [shareableUrl, setShareableUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

  // Create and cleanup video URL when file changes
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedFile]);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file");
      return;
    }

    const MAX_FILE_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert("File size should be less than 100MB. Try trimming it a bit.");
      return;
    }

    event.target.value = "";
    setSelectedFile(file);
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) {
      alert("Please select a video file first");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessages = {
          413: "File is too large (max 100MB)",
          415: "Invalid file type",
          429: "Too many uploads. Please try again later",
          default: "Upload failed. Please try again",
        };
        throw new Error(errorMessages[response.status] || data.error || errorMessages.default);
      }

      const fullUrl = `${window.location.origin}${data.shareableUrl}`;
      setShareableUrl(fullUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-8 w-full">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Refine</h1>
          <p className="text-gray-600 text-lg">Form Checks Made Ridiculously Simple.</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="video/*"
        />

        {!shareableUrl ? (
          <>
            {!selectedFile ? (
              <button
                onClick={triggerFileInput}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mx-auto block"
              >
                {isMobile ? "Choose Video from Gallery" : "Select Video"}
              </button>
            ) : (
              <div className="space-y-4">
                <VideoPlayer
                  videoUrl={videoUrl}
                  onError={(e) => {
                    console.error("Video error:", e);
                    alert("Error loading video");
                  }}
                />
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setVideoUrl("");
                      triggerFileInput();
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Choose Different Video
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center">
            <div className="p-4 rounded-lg max-w-md text-center">
              <h3 className="font-bold">Video Successfully Uploaded!</h3>
              <p className="mb-2 font-medium">Share this link with your coach:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareableUrl}
                  readOnly
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(shareableUrl);
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 2000);
                    } catch (error) {
                      alert("Please copy the link manually");
                    }
                  }}
                  className={`p-2 transition-all duration-200 flex items-center gap-2 ${
                    copySuccess ? "text-green-600" : "text-gray-600 hover:text-black"
                  }`}
                  title="Copy to clipboard"
                >
                  {copySuccess ? (
                    <>
                      <span className="text-sm animate-fade-in">Copied!</span>
                    </>
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoUpload;

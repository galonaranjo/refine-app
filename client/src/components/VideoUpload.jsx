import { useState, useCallback, useRef, useEffect } from "react";

function VideoUpload() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [shareableUrl, setShareableUrl] = useState("");

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
        throw new Error(data.error || "Upload failed");
      }

      const fullUrl = `${window.location.origin}${data.shareableUrl}`;
      setShareableUrl(fullUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-6">
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
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                {isMobile ? "Choose Video from Gallery" : "Select Video"}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative h-[70vh]">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-contain rounded-lg"
                    controls
                  />
                </div>
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
                    className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400"
                  >
                    {isUploading ? "Uploading..." : "Submit"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-4 bg-gray-100 rounded-lg max-w-md w-full text-center">
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
                    alert("Link copied!");
                  } catch (error) {
                    alert("Please copy the link manually");
                  }
                }}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoUpload;

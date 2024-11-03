import { useState, useCallback, useRef } from "react";
import VideoTrimmer from "./VideoTrimmer";

function VideoUpload() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file");
      return;
    }

    const MAX_FILE_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert("File size should be less than 100MB");
      return;
    }

    setSelectedFile(file);
  }, []);

  const triggerFileInput = useCallback(() => {
    if (isMobile) {
      fileInputRef.current.accept = "video/*";
      fileInputRef.current.capture = false;
    } else {
      fileInputRef.current.accept = "video/*";
    }
    fileInputRef.current.click();
  }, [isMobile]);

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="video/*"
        capture={false}
      />

      {!selectedFile ? (
        <button
          onClick={triggerFileInput}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          {isMobile ? "Choose Video from Gallery" : "Select Video"}
        </button>
      ) : (
        <div className="space-y-4">
          <VideoTrimmer file={selectedFile} />
          <button
            onClick={() => setSelectedFile(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Choose Different Video
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoUpload;

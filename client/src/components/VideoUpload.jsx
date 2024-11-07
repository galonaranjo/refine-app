import { useState, useCallback, useRef } from "react";
import VideoTrimmer from "./VideoTrimmer";
import VideoPlayer from "./VideoPlayer";

function VideoUpload() {
  //**********************************************************/
  //******************** State and Refs ********************//
  //**********************************************************/
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoKey, setVideoKey] = useState(0);
  const [mode, setMode] = useState("play"); // 'play' or 'trim'
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  //**********************************************************/
  //******************** File Handling ********************//
  //**********************************************************/
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
    event.target.value = ""; //Clear the input value to ensure change event fires
    setSelectedFile(file);
    setVideoKey((prev) => prev + 1);
  }, []);

  //**********************************************************/
  //******************** UI Interactions ********************//
  //**********************************************************/
  const triggerFileInput = useCallback(() => {
    if (isMobile) {
      fileInputRef.current.accept = "video/*";
      fileInputRef.current.capture = false;
    } else {
      fileInputRef.current.accept = "video/*";
    }
    fileInputRef.current.click();
  }, [isMobile]);

  //**********************************************************/
  //******************** API Integration ********************//
  //**********************************************************/
  const handleSubmit = async () => {
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

      setUploadedUrl(data.url);
      alert("Video uploaded successfully!");
      setSelectedFile(null);
      setVideoKey((prev) => prev + 1);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  //**********************************************************/
  //******************** Render ********************//
  //**********************************************************/
  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="video/*"
        capture={false}
      />

      {/* File Selection UI */}
      {!selectedFile ? (
        <button
          onClick={triggerFileInput}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          {isMobile ? "Choose Video from Gallery" : "Select Video"}
        </button>
      ) : (
        <div className="space-y-4">
          {/* Video Player Component */}
          <VideoPlayer key={videoKey} file={selectedFile} mode={mode} onModeChange={setMode} />

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setSelectedFile(null);
                triggerFileInput();
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Choose Different Video
            </button>
            <button
              onClick={() => setMode(mode === "play" ? "trim" : "play")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              {mode === "play" ? "Trim Video" : "Cancel Trim"}
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoUpload;

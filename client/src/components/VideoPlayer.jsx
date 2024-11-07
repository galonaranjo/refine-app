import { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useFFmpeg } from "../hooks/useFFmpeg";
import TrimControls from "./TrimControls";

function VideoPlayer({ file, mode = "play", onModeChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  const { loading: ffmpegLoading, trimVideo } = useFFmpeg();
  const [trimRange, setTrimRange] = useState([0, 0]);

  const handleTrimRangeChange = useCallback((range) => {
    setTrimRange(range);
  }, []);

  const handleTrim = useCallback(async () => {
    try {
      const trimmedBlob = await trimVideo(file, trimRange[0], trimRange[1]);
      const url = URL.createObjectURL(trimmedBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trimmed-video.mp4";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error trimming video:", error);
      alert("Error trimming video. Please try again.");
    }
  }, [file, trimRange, trimVideo]);

  return (
    <div className="relative h-[70vh]">
      <video
        ref={videoRef}
        src={file ? URL.createObjectURL(file) : ""}
        className="w-full h-full object-contain rounded-lg"
        controls={mode === "play"}
      />

      {mode === "trim" && (
        <>
          <TrimControls duration={duration} onTrimRangeChange={handleTrimRangeChange} loading={ffmpegLoading} />
          <button
            onClick={handleTrim}
            disabled={ffmpegLoading}
            className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400">
            {ffmpegLoading ? "Processing..." : "Save Trim"}
          </button>
        </>
      )}
    </div>
  );
}

VideoPlayer.propTypes = {
  file: PropTypes.object,
  mode: PropTypes.oneOf(["play", "trim"]),
  onModeChange: PropTypes.func,
};

export default VideoPlayer;

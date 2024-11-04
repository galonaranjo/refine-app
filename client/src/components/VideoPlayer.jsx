import { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

function VideoPlayer({ file }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const videoRef = useRef(null);

  // Create video URL when file changes
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);

      // Cleanup URL when component unmounts or file changes
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const togglePlay = useCallback(async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          await videoRef.current.pause();
        } else {
          await videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Error toggling play:", error);
      }
    }
  }, [isPlaying]);

  return (
    <div className="relative">
      {/* Video Container */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      </div>

      {/* Basic Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <button onClick={togglePlay} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded">
          {isPlaying ? "Pause" : "Play"}
        </button>
        <span className="ml-4 text-white">
          {Math.floor(currentTime)}s / {Math.floor(duration)}s
        </span>
      </div>
    </div>
  );
}

VideoPlayer.propTypes = {
  file: PropTypes.object,
};

export default VideoPlayer;

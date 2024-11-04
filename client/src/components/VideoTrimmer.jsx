import { useState, useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function VideoTrimmer({ file }) {
  const [loading, setLoading] = useState(false);
  const [trimRange, setTrimRange] = useState([0, 0]);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const ffmpegRef = useRef(new FFmpeg());

  // Handle video load
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      setTrimRange([0, videoDuration]);
    }
  }, []);

  // Handle trimming
  const handleTrim = async () => {
    try {
      setLoading(true);
      const ffmpeg = ffmpegRef.current;

      // Load FFmpeg if not already loaded
      if (!ffmpeg.loaded) {
        await ffmpeg.load({
          coreURL: await toBlobURL("/node_modules/@ffmpeg/core/dist/ffmpeg-core.js", "text/javascript"),
          wasmURL: await toBlobURL("/node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm", "application/wasm"),
        });
      }

      // Write the file to FFmpeg's file system
      await ffmpeg.writeFile("input.mp4", await fetchFile(file));

      // Trim the video
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-ss",
        trimRange[0].toString(),
        "-t",
        (trimRange[1] - trimRange[0]).toString(),
        "-c",
        "copy",
        "output.mp4",
      ]);

      // Read the result
      const data = await ffmpeg.readFile("output.mp4");
      const trimmedVideo = new Blob([data.buffer], { type: "video/mp4" });

      // Create download link
      const url = URL.createObjectURL(trimmedVideo);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trimmed-video.mp4";
      a.click();

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error trimming video:", error);
      alert("Error trimming video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Video Preview */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={file ? URL.createObjectURL(file) : ""}
          controls
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full"
        />
      </div>

      {/* Trimming Controls */}
      <div className="space-y-4">
        <Slider range min={0} max={duration} value={trimRange} onChange={setTrimRange} className="my-4" />

        <div className="flex justify-between text-sm text-gray-600">
          <span>Start: {trimRange[0].toFixed(2)}s</span>
          <span>End: {trimRange[1].toFixed(2)}s</span>
        </div>

        <button
          onClick={handleTrim}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white transition-colors
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
          {loading ? "Processing..." : "Trim Video"}
        </button>
      </div>
    </div>
  );
}

export default VideoTrimmer;

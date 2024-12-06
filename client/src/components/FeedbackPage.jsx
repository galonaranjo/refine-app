import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import RecordButton from "./RecordButton";
import VideoPlayer from "./VideoPlayer";

function FeedbackPage() {
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get("video");
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  if (!videoUrl) {
    return <div className="text-red-500">No video URL provided</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-8 w-full">
        <div className="space-y-4">
          <VideoPlayer
            videoRef={videoRef}
            videoUrl={videoUrl}
            onError={(e) => {
              console.error("Video error:", e);
              setError("Error loading video");
            }}
          />
          {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500">
              {error}
            </div>
          )}

          <RecordButton videoRef={videoRef} />
        </div>
      </div>
    </div>
  );
}

export default FeedbackPage;

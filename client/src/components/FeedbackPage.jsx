import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import RecordButton from "./RecordButton";

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
      <div className="space-y-6">
        <div className="relative h-[70vh] bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain rounded-lg"
            controls
            playsInline
            crossOrigin="anonymous"
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
        </div>

        <RecordButton videoRef={videoRef} />
      </div>
    </div>
  );
}

export default FeedbackPage;

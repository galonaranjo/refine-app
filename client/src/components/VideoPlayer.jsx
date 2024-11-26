import { useState } from "react";

function VideoPlayer({ videoRef, videoUrl, onError, controls = true }) {
  const [aspectRatio, setAspectRatio] = useState(16 / 9);

  //Checking aspect ratio to make sure video is easy to view on any screen.
  const handleVideoLoad = (event) => {
    const video = event.target;
    const ratio = video.videoWidth / video.videoHeight;
    setAspectRatio(ratio);
  };

  return (
    <div
      className={`mx-auto ${aspectRatio < 1 ? "h-[70vh]" : "max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw]"}`}
      style={aspectRatio < 1 ? { width: `${aspectRatio * 70}vh` } : {}}
    >
      <div
        className={`relative w-full bg-gray-900 rounded-lg overflow-hidden ${aspectRatio < 1 ? "h-full" : ""}`}
        style={{
          ...(aspectRatio >= 1 && { paddingTop: `${(1 / aspectRatio) * 100}%` }),
        }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="absolute top-0 left-0 w-full h-full object-contain"
          controls={controls}
          playsInline
          crossOrigin="anonymous"
          onLoadedMetadata={handleVideoLoad}
          onError={onError}
        />
      </div>
    </div>
  );
}

export default VideoPlayer;

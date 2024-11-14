import { useState, useRef } from "react";

export function useVideoRecorder(videoRef) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioStreamRef = useRef(null);

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        echoCancellation: true,
        noiseSuppression: true,
      });
      audioStreamRef.current = audioStream;

      const videoElement = videoRef.current;
      const videoStream = videoElement.captureStream();

      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        audioStream.getAudioTracks()[0],
      ]);

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        // Create download link
        const a = document.createElement("a");
        a.href = url;
        a.download = "feedback-recording.webm";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        chunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Could not start recording. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      }
    }
  };

  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
  };
}

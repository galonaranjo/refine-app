import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";

function CoachingFeedback() {
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`/api/feedback/${id}`);
        if (!response.ok) {
          throw new Error("Video not found");
        }
        const data = await response.json();
        setVideoData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!videoData) return <div>Video not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video Feedback</h1>
      <div className="aspect-video mb-4">
        <video src={videoData.url} controls className="w-full h-full rounded-lg" />
      </div>
      {/* Add feedback form or other coaching tools here */}
    </div>
  );
}

export default CoachingFeedback;

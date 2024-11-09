function VideoSuccess({ url, coachingUrl }) {
  const fullCoachingUrl = `${window.location.origin}${coachingUrl}`;

  return (
    <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-center space-x-2">
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800">Upload Successful!</h2>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <p className="text-gray-600">Share this link with your coach:</p>
        <div className="w-full max-w-xl p-3 bg-white rounded border break-all">
          <a
            href={fullCoachingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600">
            {fullCoachingUrl}
          </a>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => navigator.clipboard.writeText(fullCoachingUrl)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Copy Link
          </button>
          <a
            href={fullCoachingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Preview
          </a>
        </div>
      </div>
    </div>
  );
}

export default VideoSuccess;

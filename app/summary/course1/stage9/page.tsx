import React from 'react';

export default function Stage9Page() {
  return (
    <div className="flex items-center justify-center bg-black">
      <iframe
        width="1200"
        height="600"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=fJ6tLpKaifk9OQpB"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg shadow-lg block"
      />
    </div>
  );
}
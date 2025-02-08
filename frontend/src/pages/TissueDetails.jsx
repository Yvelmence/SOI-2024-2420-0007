import React from 'react';
import { useParams } from 'react-router-dom';

function TissueDetails() {
  // 1. Grab the dynamic ":name" param from the URL
  const { name } = useParams();

  // 2. Optionally, fetch or store additional data about this tissue
  // For simplicity, let's just show some placeholder text

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 capitalize">
        Tissue Details: {name}
      </h1>
      <p className="text-lg">
        Here, you can display detailed information about the <strong>{name}</strong> tissue.
        You might include extra images, histology descriptions, or other facts.
      </p>
    </div>
  );
}

export default TissueDetails;

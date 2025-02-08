import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';



function TissueDetails () {
  const { name } = useParams(); // Get organ from URL parameter
  const [tissue, setTissue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchTissueDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tissues/${name}`); // API URL
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setTissue(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTissueDetails();
  }, [name]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!tissue) return <p className="text-center text-gray-500">No details found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800">{tissue.name}</h1>
      <p className="text-lg mt-2"><strong>Description:</strong> {tissue.description}</p>
      <p className="text-lg mt-2"><strong>Histology:</strong> {tissue.histology}</p>
    </div>
  );
};
export default TissueDetails;

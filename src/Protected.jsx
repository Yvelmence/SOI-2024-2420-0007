import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Protected = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/protected', {
          headers: {
            Authorization: token
          }
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch protected data');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
      {error && <p className="text-red-600">{error}</p>}
      {data && <p>{data.message}</p>}
    </div>
  );
};

export default Protected;
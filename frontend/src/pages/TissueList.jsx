import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TissueList = () => {
  const [tissues, setTissues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTissues = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/tissuelist");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging line
        setTissues(data); // data is an array of objects
      } catch (error) {
        console.error("Error fetching tissue list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTissues();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!tissues.length) {
    return <p>No tissues found.</p>;
  }

  return (
    <div>
      <h1>Tissue List</h1>
      <ul>
        {tissues.map((tissue) => (
          <li key={tissue._id}> {/* Use _id as the key */}
            <Link to={`/tissue/${tissue.name}`}>{tissue.name}</Link> {/* Access the 'name' field */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TissueList;

import React, { useEffect, useState } from "react";
import axios from "axios";

function Checkins({ userId }) {
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/checkins/${userId}`)
      .then((resp) => setCheckins(resp.data));
  }, [userId]);

  return (
    <div>
      <h2>Check-in History</h2>
      <ul>
        {checkins.map((c) => (
          <li key={c.id}>
            {c.timestamp}: Mood <strong>{c.mood}</strong>, Stress Level <strong>{c.stress_level}</strong> ({c.notes})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Checkins;
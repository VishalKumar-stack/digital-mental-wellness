import React, { useState } from "react";
import axios from "axios";

function CheckinForm({ userId }) {
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState(1);
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/checkin", {
      user_id: userId,
      mood,
      stress_level: stress,
      notes,
    });
    setMood("");
    setStress(1);
    setNotes("");
    alert("Check-in submitted!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Daily Check-in</h2>
      <label>
        Mood:
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">Select</option>
          <option value="Happy">Happy</option>
          <option value="Okay">Okay</option>
          <option value="Stressed">Stressed</option>
          <option value="Anxious">Anxious</option>
          <option value="Sad">Sad</option>
        </select>
      </label>
      <label>
        Stress Level (1-10):
        <input
          type="number"
          min="1"
          max="10"
          value={stress}
          onChange={(e) => setStress(e.target.value)}
        />
      </label>
      <label>
        Notes:
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
      <button type="submit">Submit Check-in</button>
    </form>
  );
}

export default CheckinForm;
import React, { useEffect, useState } from "react";
import axios from "axios";

function ResourceList() {
  const [resources, setResources] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/resources")
      .then((resp) => setResources(resp.data));
  }, []);
  return (
    <div>
      <h2>Mental Wellness Resources</h2>
      <ul>
        {resources.map((r) => (
          <li key={r.id}>
            <a href={r.link} target="_blank" rel="noopener noreferrer">{r.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ResourceList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResourceList from './ResourceList';
import CheckinForm from './CheckinForm';
import Checkins from './Checkins';

function App() {
  const [user, setUser] = useState(null);

  // Demo: hardcoded user registration.
  useEffect(() => {
    async function register() {
      let resp = await axios.post('http://localhost:5000/api/register', {
        username: 'student123',
        email: 'student@college.edu'
      }).catch(e => null);
      if (resp && resp.data) setUser(resp.data);
    }
    register();
  }, []);

  if (!user) return <div>Registering user...</div>;

  return (
    <div>
      <h1>Student Wellness Dashboard</h1>
      <CheckinForm userId={user.id} />
      <Checkins userId={user.id} />
      <ResourceList />
    </div>
  );
}

export default App;
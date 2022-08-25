import React, { useState, useContext } from 'react'; 
import { SessionContext } from '../net/Session';

/**
 * The user profile page.
 */
function Profile() {
  const session = useContext(SessionContext);
  return <form>
    <div className="mb-3">
      <h2>Profile</h2>
      <label htmlFor="name" className="form-label">Name</label>
      <input type="name" className="form-control" id="name" value={session.user.name} readOnly={true}/>

      <label htmlFor="email" className="form-label">Email address</label>
      <input type="email" className="form-control" id="email" value={session.user.email} readOnly={true}/>
    </div>
  </form>;
}

export default Profile;
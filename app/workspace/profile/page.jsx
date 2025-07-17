"use client";

import React from 'react';
import { UserProfile } from '@clerk/nextjs';

function Profile() {
  return (
    <div className="p-6 md:p-10">
      <h2 className="font-bold text-3xl mb-6">Manage Your Profile</h2>
      <div className="bg-white p-4 rounded-xl shadow-md">
        <UserProfile />
      </div>
    </div>
  );
}

export default Profile;

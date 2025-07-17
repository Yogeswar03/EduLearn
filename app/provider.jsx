"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";
import { SelectedCourseIndexContext } from "@/context/SelectedCourseIndexContext";

function Provider({ children }) {
  const { user } = useUser();
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [userDetail, setUserDetail] = useState();

  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);

  const CreateNewUser = async () => {
    try {
      const result = await axios.post("/api/user", {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
      });
      setUserDetail(result.data);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <SelectedCourseIndexContext.Provider value={{ selectedCourseIndex, setSelectedCourseIndex }}>
        {children}
      </SelectedCourseIndexContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default Provider;

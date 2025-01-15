/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client';

import styles from "@/styles/MyProfile.module.css";
import UserProfile from "@/utils/interfaces/UserProfile";
import { Loading, ToastNotification } from "@carbon/react";
import { useEffect, useState } from "react";

export default function ProfileDetails({ userProfilePromise }: {userProfilePromise: Promise<UserProfile>}) {
  const WEB_UI_CLIENT_NAME = "web-ui";

  const [{ userData, roleName }, setUserProfile] = useState<UserProfile>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  useEffect(() => {

    const loadUserProfile = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const userProfile = await userProfilePromise;
        setUserProfile(userProfile);
      } catch (err) {
        setIsError(true);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [userProfilePromise]);

  return (
    <div className={styles.profileDetails}>
      { isLoading ?
        <Loading data-testid="loader" small={false} active={isLoading} />
        :
        <>
          <div className={styles.userDetailsContainer}>
            <h3>User Details</h3>
            <p>Currently logged in as: {userData?.loginId}</p>
            <p>Role: {roleName}</p>
          </div>

          <div className={styles.loginActivityContainer}>
            <h3>Recent Login Activity</h3>
            {
              userData?.clients?.map((client, index) => {
                let lastLoginDateStr: string;
                if (client.lastLogin) {
                  const clientLastLoginDate = new Date(client.lastLogin);
                  lastLoginDateStr = `${clientLastLoginDate.toUTCString()}`;
                } else {
                  lastLoginDateStr = "No last login date";
                }

                return (
                  <p key={index}>
                    {
                      client.clientName === WEB_UI_CLIENT_NAME
                        ? `Last logged in to this web application (UTC): ${lastLoginDateStr}`
                        : `Last logged in using a Galasa personal access token (UTC): ${lastLoginDateStr}`
                    }
                  </p>
                );
              })
            }
          </div>
        </>
      }
      { isError &&
        <ToastNotification
          hideCloseButton
          aria-label="closes notification"
          kind="error"
          statusIconDescription="notification"
          subtitle="Failed to fetch user profile data."
          title="Internal Server Error"
        />
      }
    </div>
  );
}

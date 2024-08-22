/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client'

import { useEffect, useState } from "react";
import { Loading } from "@carbon/react"
import styles from "../../styles/MyProfile.module.css"
import "../../styles/global.scss"
import PageTile from "@/components/PageTile";

export default function MyProfilePage() {

    const [isLoading, setIsLoading] = useState(false)
    const [loginId, setLoginId] = useState("")

    const handleFetchUserData = async () => {

        setIsLoading(true)

        try {
            const response = await fetch('/users', { method: 'GET' })

            if (response.ok) {

                const data = await response.text();
                setLoginId(data)

            }

        } catch (err) {
            console.log(err);
        }
        finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {

        handleFetchUserData()

    }, [])

    return (
        <div id="content" className={styles.content}>
            <PageTile title={"Profile"} />

            {isLoading ?
                <Loading data-testid="loader" small={false} active={isLoading} />
                :
                <div className={styles.userNameContainer}>
                    <h5>User: </h5>
                    <p> &nbsp; {loginId}</p>
                </div>
            }
        </div>

    );
};

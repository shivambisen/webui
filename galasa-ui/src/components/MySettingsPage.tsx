/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client'

import { useEffect, useState } from "react";
import { Loading, Button } from "@carbon/react"
import styles from "@/styles/MySettings.module.css"
import TokenCard from "@/components/TokenCard";
import ErrorPage from "@/app/error/page"
import TokenRequestModal from "@/components/TokenRequestModal";
import TokenDeleteModal from "@/components/TokenDeleteModal";
import Token from "@/utils/interfaces/Token";

export default function MySettingsPage() {

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
    const [tokens, setTokens] = useState<Set<Token>>(new Set())
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)



    const selectTokenForDeletion = (tokenId: string) => {

        if (selectedTokens.has(tokenId)) {

            setSelectedTokens((prevSelectedTokens) => {
                const newSet = new Set(prevSelectedTokens);
                newSet.delete(tokenId);
                return newSet;
            });
        }
        else {
            setSelectedTokens((prevSelectedTokens) => {
                const newSet = new Set(prevSelectedTokens);
                newSet.add(tokenId);
                return newSet;
            });

        }
    }

    const fetchAccessTokens = async () => {

        setIsLoading(true)

        try {
            const response = await fetch('/auth/tokens', { method: 'GET' })

            if (response.ok) {

                const data = await response.json();

                setTokens(data)

            }

        } catch (err) {
            setIsError(true)
        }
        finally {
            setIsLoading(false)
        }

    }

    const updateDeleteModalState = () => {
        setIsDeleteModalOpen(false)
    }

    const deleteTokenFromSet = (token: Token) => {
        setTokens((prevTokens) => {
            const newTokens = new Set(prevTokens);
            newTokens.delete(token);
            return newTokens;
        });

        setSelectedTokens((prevSelectedTokens) => {
            const newSelectedTokens = new Set(prevSelectedTokens);
            newSelectedTokens.delete(token.tokenId);
            return newSelectedTokens;
        });

        setIsDeleteModalOpen(false)
    }

    useEffect(() => {

        fetchAccessTokens()

    }, [])

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return (
            <ErrorPage />
        )
    }

    return (
        <div className={styles.container}>

            <div className={styles.tokenContainer}>
                <h3 className={styles.title}>Access Tokens</h3>

                <div className={styles.titleContainer}>
                    <div>
                        <h4 className={styles.heading}>An access token is a unique secret key held by a client program so it has permission to use the Galasa service</h4>
                        <h4 className={styles.heading}>A token has the same access rights as the user who allocated it.</h4>
                    </div>

                    <div className={styles.btnContainer}>
                        <TokenRequestModal isDisabled={selectedTokens.size > 0 ? true : false} />

                        <Button onClick={() => setIsDeleteModalOpen(true)} className={styles.deleteBtn} disabled={selectedTokens.size === 0} kind="danger">
                            Delete {selectedTokens.size} selected access tokens
                        </Button>
                    </div>
                </div>

                <div title="Access Tokens" className={styles.tokensList}>
                    {
                        Array.from(tokens).map((token) => (
                            <TokenCard token={token} selectTokenForDeletion={selectTokenForDeletion} />
                        ))
                    }
                </div>

                {
                    isDeleteModalOpen && <TokenDeleteModal tokens={tokens} selectedTokens={selectedTokens} deleteTokenFromSet={deleteTokenFromSet} updateDeleteModalState={updateDeleteModalState} />
                }
            </div>

        </div>
    );
};

/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client'

import { useEffect, useState } from "react";
import { Loading, Button} from "@carbon/react"
import PageTile from "@/components/PageTile";
import styles from "../../styles/MySettings.module.css"
import TokenCard from "@/components/TokenCard";
import ErrorPage from "../error/page";
import TokenRequestModal from "@/components/TokenRequestModal";
import TokenDeleteModal from "@/components/TokenDeleteModal";
import TokenResponseModal from "@/components/TokenResponseModal";

export default function MySettingsPage() {

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
    const [tokens, setTokens] = useState<Set<Token>>(new Set())
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    interface Token {
        tokenId: string;
        description: string;
        creationTime: string;
        owner: {
            loginId: string;
        };
    }

    const handleSelectTokensForDeletion = (tokenId: any) => {

        if (selectedTokens.has(tokenId)) {
            selectedTokens.delete(tokenId);

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

    const handleFetchAccessTokens = async () => {

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

    const handleUpdateDeleteModalState = () => {
        setIsDeleteModalOpen(false)
    }

    const handleUpdateTokens = (token : any) => {
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

        handleFetchAccessTokens()

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
        <div id="content" className={styles.content}>
            <PageTile title={"My Settings"} />

            <div className={styles.tokenContainer}>
                <h4 style={{ margin: "1rem 0" }}>Access Tokens</h4>

                <div className={styles.titleContainer}>
                    <div>
                        <h5 className={styles.heading}>An access token is a unique secret key held by a client program so it has permission to use the Galasa service</h5>
                        <h5 className={styles.heading}>A token has the same access rights as the user who allocated it.</h5>
                    </div>

                    <div>
                        <TokenRequestModal isDisabled={selectedTokens.size > 0 ? true : false} />

                        <Button onClick={() => setIsDeleteModalOpen(true)} className={styles.deleteBtn} disabled={selectedTokens.size === 0} kind="danger">
                            Delete {selectedTokens.size} selected access tokens
                        </Button>

                        <TokenResponseModal/>

                    </div>
                </div>

                <div title="Access Tokens" className={styles.tokensList}>
                    {
                        Array.from(tokens).map((token) => (
                            <TokenCard key={token.tokenId} tokenId={token.tokenId} tokenDescription={token.description} createdAt={token.creationTime} owner={token.owner.loginId} handleSelectTokensForDeletion={handleSelectTokensForDeletion} />
                        ))
                    }
                </div>

                {
                    isDeleteModalOpen && <TokenDeleteModal tokens={tokens} selectedTokens={selectedTokens} handleUpdateTokens={handleUpdateTokens} handleUpdateDeleteModalState={handleUpdateDeleteModalState}/>
                }
            </div>

        </div>
    );
};

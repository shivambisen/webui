/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client';

import { useRef, useState } from 'react';
import { TextInput } from '@carbon/react';
import { InlineNotification } from '@carbon/react';
import { Loading,Modal} from "@carbon/react"

export default function TokenRequestModal({ tokens, selectedTokens, handleUpdateTokens, handleUpdateDeleteModalState }: { tokens: any, selectedTokens: any, handleUpdateTokens: any, handleUpdateDeleteModalState:any }) {

    const [open, setOpen] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    interface Token {
        tokenId: string;
        description: string;
        creationTime: string;
        owner: {
            loginId: string;
        };
    }

    const handleDeleteTokensById = async () => {

        try {

            setIsLoading(true)
            //Convert set to array so we can iterate for it
            const tokensArray: Token[] = Array.from(tokens);

            for (const token of tokensArray) {  //using loop to handle multiple token deletion at once
                if (selectedTokens.has(token.tokenId)) {

                    const response = await fetch(`/auth/tokens`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ tokenId: token.tokenId }),
                    });

                    if (response.ok) {

                        //Update the tokens after deletion
                        handleUpdateTokens(token)
                        setOpen(false)

                    }
                }
            }

        } catch (err) {
            let errorMessage = '';

            if (err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = String(err);
            }

            setError(errorMessage);
            console.error('Failed to request a personal access token: %s', err);
        }
        finally {
            setIsLoading(false)
        }

    }

    if(isLoading){
        <Loading  />
    }


    return (
        <>
            <Modal
                modalHeading="Delete Access Tokens"
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
                danger
                shouldSubmitOnEnter={true}
                open={open}
                onRequestClose={() => {
                    setOpen(false);
                    setError('');
                    handleUpdateDeleteModalState()
                }}
                onRequestSubmit={async () => {
                    await handleDeleteTokensById();
                }}
            >
                <h6 className='margin-top-1'>
                    Number of access tokens to delete: {selectedTokens.size}
                </h6>

                <div className='margin-top-2'>
                    <InlineNotification
                        title="Client programs using these access tokens will no longer have access to this Galasa Service."
                        subtitle="This operation is irreversible, though new access tokens can be created to replace the ones being deleted."
                        kind="warning"
                        lowContrast
                        hideCloseButton
                    />
                </div>
                <br />

                {error && (
                    <InlineNotification
                        className="margin-top-1"
                        title="Error requesting access token"
                        subtitle={error}
                        kind="error"
                        onCloseButtonClick={() => setError('')}
                        lowContrast
                    />
                )}
            </Modal>
        </>
    );
};

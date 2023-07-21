 /*
 * Copyright contributors to the Galasa project
 */
'use client';

import { Button, Modal } from '@carbon/react';
import { useRef, useState } from 'react';
import { TextInput, PasswordInput } from '@carbon/react';
import { TokenTable } from './Table';
import { InlineNotification } from '@carbon/react';

const headers = [
  { key: 'tokenName', header: 'Token' },
  { key: 'scope', header: 'Scope' },
  { key: 'expires', header: 'Expires' },
];

const rows = [
  { id: '1234', tokenName: 'tkn1Example', scope: 'ALL', expires: '2023-10-22' },
  { id: '5678', tokenName: 'tkn2Example', scope: 'ALL', expires: '2023-09-31' },
];

export default function TokenRequestModal() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const tokenNameInputRef = useRef<HTMLInputElement>();
  const secretInputRef = useRef<HTMLInputElement>();

  const onChangeInputValidation = () => {
    const tokenName = tokenNameInputRef.current?.value ?? '';
    const secret = secretInputRef.current?.value ?? '';
    setSubmitDisabled(!tokenName || !secret);
  };

  const submitTokenRequest = async () => {
    const tokenName = tokenNameInputRef.current?.value ?? '';
    const secret = secretInputRef.current?.value ?? '';

    const codedSecret = Buffer.from(secret).toString('base64');

    // Call out to /auth/token with the payload for the name and secret for dex
    const tokenUrl = '/auth/token';
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: JSON.stringify({ name: tokenName, secret: codedSecret }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });

    const responseJson = await response.json();
    if (responseJson.error) {
      setError(responseJson.error);
    } else {
      // Redirect to authenticate with Dex
      window.location.replace(responseJson.url);
    }
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>Request Access Token</Button>
      <TokenTable headers={headers} rows={rows} />
      <Modal
        modalHeading="Request a new Personal Access Token"
        modalLabel="Access Tokens"
        primaryButtonText="Submit"
        primaryButtonDisabled={submitDisabled}
        secondaryButtonText="Cancel"
        shouldSubmitOnEnter={true}
        open={open}
        onRequestClose={() => {
          setOpen(false);
          setError('');
        }}
        onRequestSubmit={async () => {
          if (!submitDisabled) {
            await submitTokenRequest();
          }
        }}
      >
        <TextInput
          data-modal-primary-focus
          ref={tokenNameInputRef}
          id="name-txtinput"
          labelText="Token Name" 
          helperText="The name of the Token you will use to access the galasa ecosystem."
          
          onChange={onChangeInputValidation}
          invalidText="Please check that the Token Name supplied does not contain any special characters (?,.!@#$*&) or whitespace characters"
        />
        <br style={{ marginBottom: '1rem' }} />
        <PasswordInput
          data-modal-primary-focus
          ref={secretInputRef}
          id="secret-txtinput"
          labelText="Galasa Client Secret"
          helperText="The Client secret that you will use alongside your token to access the galasa ecosystem."
          onChange={onChangeInputValidation}
          invalidText="Please check that the Secret supplied does not contain any special characters (?,.!@#$*&) or whitespace characters"
        />
        {error && (
          <InlineNotification
            title="Error Requesting Access Token"
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

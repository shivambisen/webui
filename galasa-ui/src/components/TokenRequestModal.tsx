 /*
 * Copyright contributors to the Galasa project
 */
'use client';

import { Button, Modal } from '@carbon/react';
import { useState } from 'react';
import { TextInput, PasswordInput } from '@carbon/react';
import { TokenTable } from './Table';
import { InlineNotification } from '@carbon/react';

const headers = [
  {
    key: 'tokenName',
    header: 'Token',
  },
  {
    key: 'scope',
    header: 'Scope',
  },
  {
    key: 'expires',
    header: 'Expires',
  },
];

const rows = [
  {
    id: '1234',
    tokenName: 'tkn1Example',
    scope: 'ALL',
    expires: '2023-10-22',
  },
  {
    id: '5678',
    tokenName: 'tkn2Example',
    scope: 'ALL',
    expires: '2023-09-31',
  },
];

export default function TokenRequestModal() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [secretInvalid, setSecretInvalid] = useState(false);
  
  //Handle change events to the input fields to check that Token Name and/or Secret do not have special characters or whitespace
  const handleTokenChange = (element: { target: { value: any; }; }) => {
    setTokenInvalid(checkInputisValid(element.target.value));
  };
  const handleSecretChange = (element: { target: { value: any; }; }) => {
    setSecretInvalid(checkInputisValid(element.target.value));
  };
  const checkInputisValid = (inputValue: string) => {
    var isValid = true;
    // Prevent invalid from showing when the input value of is empty
    if (inputValue.length > 0){
      isValid = /^[a-zA-Z0-9]+$/.test(inputValue);
    }
    return !isValid;
  };
  const submitTokenRequest = async () => {
    const name = (document.getElementById('name-txtinput') as HTMLInputElement).value;
    const secret = (document.getElementById('secret-txtinput') as HTMLInputElement).value;
    const codedSecret = Buffer.from(secret).toString('base64');

    // Call out to /auth/token with the payload for the name and secret for dex
    const tokenUrl = '/auth/token';
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: JSON.stringify({ name, secret: codedSecret }),
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
        secondaryButtonText="Cancel"
        open={open}
        onRequestClose={() => {
          setOpen(false);
          setError('');
        }}
        onRequestSubmit={async () => {
          await submitTokenRequest();
        }}
      >
        <TextInput 
          data-modal-primary-focus 
          id="name-txtinput" 
          labelText="Token Name" 
          style={{ marginBottom: '1rem' }} 
          onChange={handleTokenChange}
          invalid = {tokenInvalid}
          invalidText = "Please check that the Token Name supplied does not contain any special characters or spaces(?,.!@#$*&)"
        />
        <PasswordInput
          data-modal-primary-focus
          id="secret-txtinput"
          labelText="Secret"
          helperText="The secret you would like to use with this token"
          onChange={handleSecretChange}
          invalid = {secretInvalid}
          invalidText = "Please check that the Secret supplied does not contain any special characters or spaces(?,.!@#$*&)"
          style={{ marginBottom: '1rem' }}
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

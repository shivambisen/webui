 /*
 * Copyright contributors to the Galasa project
 */
 'use client';

 import { Button, Modal, Dropdown } from '@carbon/react';
 import { useState } from 'react';

import { TextInput, PasswordInput } from '@carbon/react';
import { TokenTable } from './Table';
import { Form } from '@carbon/react';

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


 export default function TokenRequestModal({openState, submitState}:{openState:boolean, submitState:boolean}) {
  const [open, setOpen] = useState(openState);
  const [submit, setSubmit] = useState(submitState);
  const [token, setToken] = useState('');

  const submitTokenRequest = async (state: boolean) => {
    const name = (document.getElementById("name-txtinput") as HTMLInputElement).value;
    const secret = (document.getElementById("password-txtinput") as HTMLInputElement).value;
    const codedSecret = Buffer.from(secret).toString('base64');
    
    // Call out to auth/token with the payload for the name and secret for dex
    const tokenUrl = './auth/token';
    const res = await fetch(tokenUrl, {
      method: "POST",
      body: JSON.stringify({name: name, secret: codedSecret,}),
      headers: {"Content-type": "application/json; charset=UTF-8"}});
    const json = await res.json();
    
    setToken(json.secret);
    
    setSubmit(state);
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
        onRequestClose={() => setOpen(false)}
        onRequestSubmit={() => {
          setOpen(false)
          submitTokenRequest(true)
        }}>
        <TextInput data-modal-primary-focus id="name-txtinput" labelText="Token Name" style={{ marginBottom: '1rem'}} />
        <PasswordInput data-modal-primary-focus id="password-txtinput" labelText="Password"
            helperText="The password you would like to use with this token" style={{ marginBottom: '1rem'}} />
      </Modal>
      <Modal
        open={submit}
        passiveModal
        modalLabel="Access Tokens"
        modalHeading="Your new access token is:"
        onRequestClose={() => setSubmit(false)}>
        <p> {token}</p>
      </Modal>
    </>
  );
};


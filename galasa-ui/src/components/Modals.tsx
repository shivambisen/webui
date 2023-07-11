 /*
 * Copyright contributors to the Galasa project
 */
 'use client';

 import { Button, Modal, Dropdown } from '@carbon/react';
 import { useState } from 'react';

import { TextInput } from '@carbon/react';
import TokenTable from './Table';

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
      scope: 'Local',
      expires: '2023-09-31',
  },
];


 export default function TokenRequestModal() {
  const [open, setOpen] = useState(false);
  const [submit, setSubmit] = useState(false);
  const submitTokenRequest = (state: boolean) => {
    setSubmit(state);
/* TO DO 
 * This below line is needed in the return to make the table work
 * (Not implemented yet due to document rendering issues)
 * <TokenTable headers={headers} rows={rows} />
 */  
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>Request Access Token</Button>
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
        <TextInput data-modal-primary-focus id="text-input-1" labelText="Token Name" style={{ marginBottom: '1rem'}} />
        <Dropdown id="drop" label="Scope" titleText="Scope" items={[{
      id: 'one',
      label: 'ALL',
      name: 'ALL'
    }, {
      id: 'two',
      label: 'Local',
      name: 'Local'
    }]} />
      </Modal>
      <Modal
        open={submit}
        passiveModal
        modalLabel="Access Tokens"
        modalHeading="Your new access token is:"
        onRequestClose={() => setSubmit(false)}>
        <p> A new access token</p>
      </Modal>
    </>
  );
};


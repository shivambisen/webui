 /*
 * Copyright contributors to the Galasa project
 */
 'use client';

 import { Button, Modal } from '@carbon/react';
 import { useState } from 'react';


 export default function TokenRequestModal() {
  const [open, setOpen] = useState(false);
  const [submit, setSubmit] = useState(false);
  const submitTokenRequest = (state: boolean) => {
    setSubmit(state);
  }
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


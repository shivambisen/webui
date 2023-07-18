/*
 * Copyright contributors to the Galasa project
 */
'use client';

import { Modal, CodeSnippet } from '@carbon/react';
import { useEffect, useState } from 'react';

interface TokenResponseModalProps {
  refreshToken: string,
}

export default function TokenResponseModal({refreshToken}: TokenResponseModalProps) {
  const [token, setToken] = useState('');
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    if (refreshToken.length > 0) {
      setToken(refreshToken);
      setOpen(true);
    }
  }, [refreshToken]);
  return (
    <Modal id="token-passiveModal" open={isOpen} passiveModal modalLabel="Access Tokens" modalHeading="Your new access token is:" onRequestClose={() => {
      setOpen(false)
      const expiryDate = new Date().toUTCString()
      document.cookie = `refresh_token=; expires=${expiryDate}; path=/;`
    }}>
      <CodeSnippet type='single'>{token}</CodeSnippet>
    </Modal>
  );
}

/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

"use client";

import React, { useEffect, useState } from 'react';
import styles from "@/styles/Footer.module.css";
import { Theme } from '@carbon/react';

interface FooterProps {
  serviceHealthyPromise: Promise<boolean>;
  clientVersionPromise?: Promise<string | undefined>;
}

const Footer = ({ serviceHealthyPromise, clientVersionPromise }: FooterProps) => {

  const [isHealthOk, setIsHealthOk] = useState(true);
  const [apiVersion, setApiVersion] = useState("");

  const checkServiceHealth = async () => {
    const isPingSuccessful = await serviceHealthyPromise;
    setIsHealthOk(isPingSuccessful);
  };

  const getApiVersion = async () => {
    const apiVersion = await clientVersionPromise;
    if(apiVersion) {
      setApiVersion(apiVersion);
    }
  };

  useEffect(() => {

    checkServiceHealth();
    getApiVersion();

  }, []);

  return (
    <Theme theme="g90">
      <footer className={styles.footer} role="footer">
        {
          isHealthOk && <p>Galasa Version {apiVersion}</p>
        }
        <p>Service Health {isHealthOk ? <div className={styles.healthy} /> : <div className={styles.error} />}</p> 
      </footer>
    </Theme>
  );
};

export default Footer;
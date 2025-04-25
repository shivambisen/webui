/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

"use client";

import React, { useEffect, useState } from 'react';
import styles from "@/styles/Footer.module.css";
import { Theme } from '@carbon/react';
import { getClientApiVersion, getServiceHealthStatus } from '@/app/actions/healthActions';

export const dynamic = "force-dynamic";

const Footer = () => {

  const [isHealthOk, setIsHealthOk] = useState(true);
  const [apiVersion, setApiVersion] = useState("");

  const checkServiceHealth = async () => {
    const isPingSuccessful = await getServiceHealthStatus();
    if (isPingSuccessful !== true) {
      setIsHealthOk(false);
    }
  };

  const getApiVersion = async () => {
    const apiVersion = await getClientApiVersion();
    if(apiVersion) {
      setApiVersion(apiVersion);
    }
  };

  useEffect(() => {

    Promise.all([
      checkServiceHealth(),
      getApiVersion()
    ]);

  }, []);

  return (
    <Theme theme="g90">
      <footer className={styles.footer} role="footer">
        {
          isHealthOk && <h6>Galasa Version {apiVersion}</h6>
        }
        <h6>Service Health {isHealthOk ? <div className={styles.healthy} /> : <div className={styles.error} />}</h6> 
      </footer>
    </Theme>
  );
};

export default Footer;
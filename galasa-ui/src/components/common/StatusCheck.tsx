/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import { CheckmarkFilled, ErrorOutline,Renew, Warning } from '@carbon/icons-react'
import React from 'react'
import styles from "@/styles/StatusCheck.module.css";

function StatusCheck({ status }: { status: string }) {
  return (
    <>
      {
        status === "Passed" ? (
          <p className={styles.status}><CheckmarkFilled size={20} color='#24A148' /> {status}</p>
        ) : (status === "Failed" || status === "Hung" || status === "EnvFail") ? (
          <p className={styles.status}><ErrorOutline size={20} color='#da1e28' /> {status}</p>
        ) : (status === "Cancelled" || status === "Ignored") ? (
          <p className={styles.status}><ErrorOutline size={20} color='#6f6f6f' /> {status}</p>
        ) : (status === "Requeued") ? (
          <p className={styles.status}><Renew size={20} color='#0043ce' /> {status}</p>
        ) : (
          <p className={styles.status}><Warning size={20} color='#f1c21b' />Unknown</p>
        )
      }
    </>
  )
}

export default StatusCheck
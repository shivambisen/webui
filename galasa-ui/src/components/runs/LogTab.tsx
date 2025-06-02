/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client';

import React from 'react';
import styles from '@/styles/LogTab.module.css';

export interface LogViewerProps {
  /** Raw log string (e.g. newline-separated) */
  logs: string;
  /** Current page number (for pagination controls) */
  page?: number;
  /** Number of lines per page (for pagination) */
  perPage?: number;
  /** Callback when page changes; provide this prop to enable pagination controls */
  onPageChange?: (page: number) => void;
}

export const LogTab: React.FC<LogViewerProps> = ({
  logs,
  page = 1,
  perPage,
  onPageChange,
}) => {
  const allLines = logs.split('\n').filter((line) => line !== '');
  const linesPerPage = perPage ?? allLines.length;
  const totalLines = allLines.length;
  const totalPages = Math.ceil(totalLines / linesPerPage);
  const displayLines = onPageChange
    ? allLines.slice((page - 1) * linesPerPage, page * linesPerPage)
    : allLines;

  return (
    <div className={styles.container}>
      <div className={styles.logContainer}>
        {displayLines.map((line, idx) => (
          <pre key={idx} className={styles.logLine}>
            {`${idx + 1}. `} <code>{line}</code>
          </pre>
        ))}
      </div>

      {onPageChange && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page === 1}
            className={styles.button + (page === 1 ? ` ${styles.disabled}` : '')}
          >
            Previous
          </button>

          <span className={styles.pageInfo}>Page {page} of {totalPages}</span>

          <button
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className={styles.button + (page === totalPages ? ` ${styles.disabled}` : '')}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
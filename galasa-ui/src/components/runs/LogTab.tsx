/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, OverflowMenu, Button } from '@carbon/react';
import styles from "@/styles/LogTab.module.css";
import { Checkbox } from '@carbon/react';
import { Filter, ChevronUp, ChevronDown, CharacterSentenceCase, TextUnderline, CloudDownload } from '@carbon/icons-react';
import { handleDownload } from '@/utils/artifacts';

interface LogLine {
  content: string;
  level: string;
  lineNumber: number;
  isVisible: boolean;
}

enum RegexFlags {
  AllMatches = 'g',
  AllMatchesIgnoreCase = 'gi',
}

export default function LogTab({ logs }: { logs: string }) {

  const [logContent, setLogContent] = useState<string>('');
  const [processedLines, setProcessedLines] = useState<LogLine[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(-1);
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [matchCase, setMatchCase] = useState<boolean>(false);
  const [matchWholeWord, setMatchWholeWord] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    ERROR: true,
    WARN: true,
    DEBUG: true,
    INFO: true,
    TRACE: true
  });

  const logContainerRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: any) => {
    const value = e.target?.value || '';
    setSearchTerm(value);
    if (!value.trim()) {
      setCurrentMatchIndex(-1);
      setTotalMatches(0);
    }
  };

  const handleFilterChange = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      [level]: !prev[level as keyof typeof prev],
    }));
  };

  const toggleMatchCase = () => {
    setMatchCase(!matchCase);
  };

  const toggleMatchWholeWord = () => {
    setMatchWholeWord(!matchWholeWord);
  };

  const goToNextMatch = () => {
    if (totalMatches > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % totalMatches);
    }
  };

  const goToPreviousMatch = () => {
    if (totalMatches > 0) {
      setCurrentMatchIndex((prev) => (prev - 1 + totalMatches) % totalMatches);
    }
  };

  const createSearchRegex = (term: string) => {

    let escapedTerm: string = "";

    if (!term.trim()) {
      escapedTerm = "";
    } else {

      escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Prefix any special regex character in `term` with a backslash so the whole string is used literally in a RegExp
      if (matchWholeWord) {
        escapedTerm = `\\b${escapedTerm}\\b`;
      }

      // If matchCase is false, we use the 'gi' flag to ignore case
      const flags = matchCase ? RegexFlags.AllMatches : RegexFlags.AllMatchesIgnoreCase;
      return new RegExp(escapedTerm, flags);

    }

    return escapedTerm;

  };

  const getLogLevel = (line: string) => {

    let filteredType = null;

    // This regex looks for a log level keyword ONLY if it follows a timestamp pattern at the start of the line.
    const match = line.match(/^\s*[\d\s\-:T,.]*Z?\s?(ERROR|WARN|DEBUG|INFO|TRACE)/);
    if (match && match[1]) {
      // If a match is found in the expected position, return it as the correct level.
      filteredType = match[1];

    } else {

      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('ERROR')) filteredType = 'ERROR';
      if (trimmedLine.startsWith('WARN')) filteredType = 'WARN';
      if (trimmedLine.startsWith('DEBUG')) filteredType = 'DEBUG';
      if (trimmedLine.startsWith('INFO')) filteredType = 'INFO';
      if (trimmedLine.startsWith('TRACE')) filteredType = 'TRACE';

    }

    // If no level can be determined, return null so it can inherit the level from the previous line.
    return filteredType;
  };

  const processLogLines = (content: string) => {
    const lines = content.split('\n');
    const processed: LogLine[] = [];
    let currentLevel = 'INFO'; // Default level

    lines.forEach((line, index) => {
      const detectedLevel = getLogLevel(line);

      // If we find a new level, update current level
      if (detectedLevel) {
        currentLevel = detectedLevel;
      }

      // All lines get assigned to the current level (either explicit or inherited)
      processed.push({
        content: line,
        level: currentLevel,
        lineNumber: index + 1,
        isVisible: true
      });
    });

    return processed;
  };

  const applyFilters = (lines: LogLine[]) => {

    const hasActiveFilters = Object.values(filters).some(filter => filter === true);
    let filteredLines = [];

    if (!hasActiveFilters) {
      // none selected → hide all
      filteredLines = lines.map(line => ({ ...line, isVisible: false }));
    }

    // only show lines whose level is still checked
    filteredLines = lines.map(line => ({
      ...line,
      isVisible: !!filters[line.level as keyof typeof filters]
    }));

    return filteredLines;
  };

  const highlightText = (text: string, searchTerm: string, lineIndex: number) => {
    let result: (string | JSX.Element)[] | string = text;

    if (searchTerm.trim()) {
      const regex = createSearchRegex(searchTerm);

      if (regex) {
        const parts = text.split(regex);
        const matches = text.match(regex);

        if (matches) {
          let matchIndexInLine = 0;
          const highlightedResult = [];

          for (let i = 0; i < parts.length; i++) {
            if (i > 0) {
              const match = matches[i - 1];
              const globalMatchIndex = getGlobalMatchIndex(lineIndex, matchIndexInLine);
              const isCurrentMatch = globalMatchIndex === currentMatchIndex;
              matchIndexInLine++;

              highlightedResult.push(
                <span
                  key={`match-${i}`}
                  className={`${styles.highlight} ${isCurrentMatch ? styles.currentHighlight : ''}`}
                  id={isCurrentMatch ? 'current-match' : undefined}
                >
                  {match}
                </span>
              );
            }
            if (parts[i]) {
              highlightedResult.push(parts[i]);
            }
          }

          result = highlightedResult;
        }
      }
    }

    return result;
  };

  const getGlobalMatchIndex = (lineIndex: number, matchIndexInLine: number) => {
    let result = -1;

    if (searchTerm.trim()) {
      const visibleLines = processedLines.filter(line => line.isVisible);
      let globalIndex = 0;

      for (let i = 0; i < lineIndex; i++) {
        if (i < visibleLines.length) {
          const regex = createSearchRegex(searchTerm);
          if (regex) {
            const matches = visibleLines[i].content.match(regex);
            if (matches) {
              globalIndex += matches.length;
            }
          }
        }
      }

      result = globalIndex + matchIndexInLine;
    }

    return result;
  };

  const countMatches = (lines: LogLine[], searchTerm: string) => {
    if (!searchTerm.trim()) return 0;
    const regex = createSearchRegex(searchTerm);
    if (!regex) return 0;

    const visibleContent = lines
      .filter(line => line.isVisible)
      .map(line => line.content)
      .join('\n');

    const matches = visibleContent.match(regex);
    return matches ? matches.length : 0;
  };

  const renderLogContent = () => {
    let result: JSX.Element[] | null = null;

    if (processedLines.length) {
      const renderedLines: JSX.Element[] = [];

      processedLines.forEach((logLine, index) => {
        // Only process visible lines
        if (logLine.isVisible) {
          // Apply appropriate class based on log level
          const levelClass = logLine.level.toLowerCase();
          const colorClass = styles[levelClass as keyof typeof styles] || "";

          renderedLines.push(
            <div
              key={logLine.lineNumber}
              className={`${colorClass} ${styles.logEntry}`}
            >
              <span className={styles.lineNumberCol}>
                {logLine.lineNumber}.
              </span>
              <pre>{highlightText(logLine.content, searchTerm, index)}</pre>
            </div>
          );
        }
      });

      result = renderedLines;
    }

    return result;
  };

  // Scroll to current match
  useEffect(() => {
    if (currentMatchIndex >= 0) {
      const currentMatchElement = document.getElementById('current-match');
      if (currentMatchElement) {
        currentMatchElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentMatchIndex]);

  // Update total matches when search term, match options, or processed lines change
  useEffect(() => {
    const matches = countMatches(processedLines, searchTerm);
    setTotalMatches(matches);

    if (matches > 0 && currentMatchIndex === -1) {
      setCurrentMatchIndex(0);
    } else if (matches === 0) {
      setCurrentMatchIndex(-1);
    } else if (currentMatchIndex >= matches) {
      setCurrentMatchIndex(matches - 1);
    }
  }, [searchTerm, logContent, filters, matchCase, matchWholeWord]);

  // Process log content and apply filters
  useEffect(() => {
    if (logContent) {
      const processed = processLogLines(logContent);
      const filtered = applyFilters(processed);
      setProcessedLines(filtered);
    }
  }, [logContent, filters]);

  useEffect(() => {
    setLogContent(logs);
  }, [logs]);

  return (
    <div className={styles.tabContent}>
      <h3>Run Log</h3>
      <p>A step-by-step log of what happened over time when the Run was preparing a TestClass for execution, what happened when the TestClass was executed, and when the test environment was cleaned up.
        The RunLog is an Artifact, which can be downloaded and viewed.</p>
      <div className={styles.logContainer}>
        <div className={styles.searchContainer}>
          <Search
            placeholder="Find in run log"
            size="lg"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <div className={styles.findControls}>
              <span className={styles.matchCounter}>
                {totalMatches > 0 ? `${currentMatchIndex + 1} of ${totalMatches}` : 'No matches'}
              </span>
              <Button
                kind="ghost"
                size="sm"
                onClick={goToPreviousMatch}
                disabled={totalMatches === 0}
                renderIcon={ChevronUp}
                iconDescription="Previous match"
                hasIconOnly
              />
              <Button
                kind="ghost"
                size="sm"
                onClick={goToNextMatch}
                disabled={totalMatches === 0}
                renderIcon={ChevronDown}
                iconDescription="Next match"
                hasIconOnly
              />
              <Button
                kind={matchCase ? "primary" : "ghost"}
                size="sm"
                onClick={toggleMatchCase}
                renderIcon={CharacterSentenceCase}
                iconDescription="Match case"
                hasIconOnly
              />
              <Button
                kind={matchWholeWord ? "primary" : "ghost"}
                size="sm"
                onClick={toggleMatchWholeWord}
                renderIcon={TextUnderline}
                iconDescription="Match whole word"
                hasIconOnly
              />
            </div>
          )}
        </div>
        <div className={styles.filterBtn}>
          <OverflowMenu size="lg" iconDescription={"Hide / Show Content"} renderIcon={Filter} flipped={true}>
            <Checkbox
              id="checkbox-error"
              labelText="Error"
              checked={filters.ERROR}
              onChange={() => handleFilterChange('ERROR')}
            />
            <Checkbox
              id="checkbox-warn"
              labelText="Warning"
              checked={filters.WARN}
              onChange={() => handleFilterChange('WARN')}
            />
            <Checkbox
              id="checkbox-info"
              labelText="Info"
              checked={filters.INFO}
              onChange={() => handleFilterChange('INFO')}
            />
            <Checkbox
              id="checkbox-debug"
              labelText="Debug"
              checked={filters.DEBUG}
              onChange={() => handleFilterChange('DEBUG')}
            />
            <Checkbox
              id="checkbox-trace"
              labelText="Trace"
              checked={filters.TRACE}
              onChange={() => handleFilterChange('TRACE')}
            />
          </OverflowMenu>
        </div>
        <Button
          kind="ghost"
          renderIcon={CloudDownload}
          hasIconOnly
          iconDescription="Download Run Log"
          onClick={() => handleDownload(logContent, "run.log")}
        />
      </div>
      <div className={styles.runLog}>
        <div className={styles.runLogContent} ref={logContainerRef}>
          {renderLogContent()}
        </div>
      </div>
    </div>
  );
}
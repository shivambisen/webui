/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
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

interface MatchInfo {
  lineIndex: number;
  start: number;
  end: number;
  globalIndex: number;
}

enum RegexFlags {
  AllMatches = 'g',
  AllMatchesIgnoreCase = 'gi',
}

export default function LogTab({ logs }: { logs: string }) {

  const [logContent, setLogContent] = useState<string>('');
  const [processedLines, setProcessedLines] = useState<LogLine[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(''); // New state for debounced term
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

  // Cache for search results to avoid recomputation
  const [searchCache, setSearchCache] = useState<Map<string, MatchInfo[]>>(new Map());

  const logContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold the debounce timeout

  const handleSearchChange = (e: any) => {
    const value = e.target?.value || '';
    setSearchTerm(value); // Update searchTerm immediately for input display

    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value); // Update debouncedSearchTerm after delay
      if (!value.trim()) {
        setCurrentMatchIndex(-1);
        setTotalMatches(0);
      }
    }, 300); // Debounce delay in milliseconds (e.g., 300ms)
  };

  const handleFilterChange = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      [level]: !prev[level as keyof typeof prev],
    }));
  };

  const toggleMatchCase = () => {
    setMatchCase(!matchCase);
    setSearchCache(new Map()); // Clear cache when search options change
  };

  const toggleMatchWholeWord = () => {
    setMatchWholeWord(!matchWholeWord);
    setSearchCache(new Map()); // Clear cache when search options change
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

  // Memoized regex creation to avoid recreating the same regex repeatedly
  const searchRegex = useMemo(() => {
    let regex: RegExp | null = null;

    if (debouncedSearchTerm.trim()) {
      let escapedTerm = debouncedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (matchWholeWord) {
        escapedTerm = `\\b${escapedTerm}\\b`;
      }
      const flags = matchCase ? RegexFlags.AllMatches : RegexFlags.AllMatchesIgnoreCase;
      regex = new RegExp(escapedTerm, flags);
    }

    return regex;
  }, [debouncedSearchTerm, matchCase, matchWholeWord]);

  const getLogLevel = (line: string) => {
    let logLevel: string | null = null;

    // Attempt to parse a timestamp and log level by splitting the line.
    const tokens = line.trim().split(' ');
    if (tokens.length >= 3 &&
      tokens[0].length === 10 && // Simple check for DD/MM/YYYY format
      tokens[0].charAt(2) === '/' &&
      tokens[0].charAt(5) === '/' &&
      tokens[1].includes(':') &&
      tokens[1].includes('.')
    ) {
      if (['ERROR', 'WARN', 'DEBUG', 'INFO', 'TRACE'].includes(tokens[2])) {
        logLevel = tokens[2];
      }
    }

    // Fallback: check if the line starts with any log level
    if (!logLevel) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('ERROR')) {
        logLevel = 'ERROR';
      } else if (trimmedLine.startsWith('WARN')) {
        logLevel = 'WARN';
      } else if (trimmedLine.startsWith('DEBUG')) {
        logLevel = 'DEBUG';
      } else if (trimmedLine.startsWith('INFO')) {
        logLevel = 'INFO';
      } else if (trimmedLine.startsWith('TRACE')) {
        logLevel = 'TRACE';
      }
    }

    return logLevel;
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

    let filteredLines = [];
    const hasActiveFilters = Object.values(filters).some(filter => filter === true);

    if (!hasActiveFilters) {
      // If no filters are active, hide all lines
      filteredLines = lines.map(line => ({ ...line, isVisible: false }));
    } else {
      // Only show lines whose level is checked in the filters
      filteredLines = lines.map(line => ({
        ...line,
        isVisible: !!filters[line.level as keyof typeof filters]
      }));
    }

    return filteredLines;

  };

  // Optimized search function that computes all matches once and caches results
  const computeSearchMatches = useCallback((lines: LogLine[], regex: RegExp | null): MatchInfo[] => {
    let result: MatchInfo[] = [];

    // Now uses debouncedSearchTerm for the condition
    if (!regex || !debouncedSearchTerm.trim()) {
      result = [];
    } else {
      try {
        // Create cache key
        const cacheKey = `${debouncedSearchTerm}-${matchCase}-${matchWholeWord}-${lines.map(l => l.isVisible).join('')}`;

        // Check cache first
        if (searchCache.has(cacheKey)) {
          result = searchCache.get(cacheKey)!;
        } else {
          const matches: MatchInfo[] = [];
          let globalIndex = 0;

          lines.forEach((line, lineIndex) => {
            if (!line.isVisible) return;

            // Reset regex lastIndex to ensure we get all matches
            regex.lastIndex = 0;
            let match;

            while ((match = regex.exec(line.content)) !== null) {
              matches.push({
                lineIndex,
                start: match.index,
                end: match.index + match[0].length,
                globalIndex: globalIndex++
              });

              // Prevent infinite loop on zero-length matches
              if (match.index === regex.lastIndex) {
                regex.lastIndex++;
              }
            }
          });

          // Cache the results
          setSearchCache(prev => new Map(prev).set(cacheKey, matches));
          result = matches;
        }
      } catch (error) {
        // If regex execution fails, return empty array
        console.warn('Regex execution error:', error);
        result = [];

      }
    }

    return result;
  }, [debouncedSearchTerm, matchCase, matchWholeWord, searchCache]); // Changed searchTerm to debouncedSearchTerm

  // Memoized search matches
  const searchMatches = useMemo(() => {
    return computeSearchMatches(processedLines, searchRegex);
  }, [processedLines, searchRegex, computeSearchMatches]);

  // Optimized highlight function
  const highlightText = useCallback((text: string, lineIndex: number): React.ReactNode => {
    let result: React.ReactNode = text;

    // Now depends on debouncedSearchTerm
    if (searchRegex && debouncedSearchTerm.trim()) {
      // Find matches for this specific line
      const lineMatches = searchMatches.filter(match => match.lineIndex === lineIndex);

      if (lineMatches.length > 0) {
        const resultArray: React.ReactNode[] = [];
        let lastEnd = 0;

        lineMatches.forEach((match, matchIndex) => {
          // Add text before match
          if (match.start > lastEnd) {
            resultArray.push(text.substring(lastEnd, match.start));
          }

          // Add highlighted match
          const isCurrentMatch = match.globalIndex === currentMatchIndex;
          const matchText = text.substring(match.start, match.end);

          resultArray.push(
            <span
              key={`match-${lineIndex}-${matchIndex}`}
              className={`${styles.highlight} ${isCurrentMatch ? styles.currentHighlight : ''}`}
              id={isCurrentMatch ? 'current-match' : undefined}
            >
              {matchText}
            </span>
          );

          lastEnd = match.end;
        });

        // Add remaining text after last match
        if (lastEnd < text.length) {
          resultArray.push(text.substring(lastEnd));
        }

        result = resultArray;
      }
    }

    return result;
  }, [searchRegex, debouncedSearchTerm, searchMatches, currentMatchIndex]); // Changed searchTerm to debouncedSearchTerm

  // Memoized filtered lines for rendering
  const visibleLines = useMemo(() => {
    return processedLines.filter(line => line.isVisible);
  }, [processedLines]);

  const renderLogContent = () => {
    let result: JSX.Element[] | null = null;

    if (visibleLines.length === 0) {
      result = null;
    } else {
      result = visibleLines.map((logLine) => {
        const levelClass = logLine.level.toLowerCase();
        const colorClass = styles[levelClass as keyof typeof styles] || "";

        return (
          <div
            key={logLine.lineNumber}
            className={`${colorClass} ${styles.logEntry}`}
          >
            <span className={styles.lineNumberCol}>
              {logLine.lineNumber}.
            </span>
            <pre>{highlightText(logLine.content, processedLines.indexOf(logLine))}</pre>
          </div>
        );
      });
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

  // Update total matches and current match index
  // Now depends on debouncedSearchTerm
  useEffect(() => {
    const matchCount = searchMatches.length;
    setTotalMatches(matchCount);

    if (matchCount > 0 && currentMatchIndex === -1) {
      setCurrentMatchIndex(0);
    } else if (matchCount === 0) {
      setCurrentMatchIndex(-1);
    } else if (currentMatchIndex >= matchCount) {
      setCurrentMatchIndex(matchCount - 1);
    }
  }, [searchMatches, currentMatchIndex, debouncedSearchTerm]); // Added debouncedSearchTerm to dependencies

  // Process log content and apply filters
  useEffect(() => {
    if (logContent) {
      const processed = processLogLines(logContent);
      const filtered = applyFilters(processed);
      setProcessedLines(filtered);
    }
  }, [logContent, filters]);

  // Clear cache when filters change
  useEffect(() => {
    setSearchCache(new Map());
  }, [filters]);

  useEffect(() => {
    setLogContent(logs);
  }, [logs]);

  // Cleanup the timeout on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

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
            value={searchTerm} // Input value still controlled by immediate searchTerm
            onChange={handleSearchChange}
          />
          {debouncedSearchTerm && ( // Display controls based on debounced term
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
/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react'; 
import styles from '@/styles/TestRunsPage.module.css';
import TimeframeContent, { calculateSynchronizedState } from './TimeFrameContent';
import TestRunsTable from './TestRunsTable';
import SearchCriteriaContent from "./SearchCriteriaContent";
import TableDesignContent from './TableDesignContent';
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { TestRunsData } from "@/utils/testRuns";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from 'react';
import { RESULTS_TABLE_COLUMNS, COLUMNS_IDS, RUN_QUERY_PARAMS, DAY_MS} from '@/utils/constants/common';
import { useQuery } from '@tanstack/react-query';
import { decodeStateFromUrlParam, encodeStateToUrlParam } from '@/utils/urlEncoder';
import { TimeFrameValues } from '@/utils/interfaces';


interface TabConfig {
  id: string;
  label: string;
}

interface TestRunsTabProps {
  requestorNamesPromise: Promise<string[]>;
  resultsNamesPromise: Promise<string[]>;
}

const TABS_IDS = ['timeframe', 'table-design', 'search-criteria', 'results'];

// Keys that are managed by the SearchCriteriaContent component
const SEARCH_CRITERIA_KEYS = [
  RUN_QUERY_PARAMS.RUN_NAME, RUN_QUERY_PARAMS.REQUESTOR, RUN_QUERY_PARAMS.GROUP,
  RUN_QUERY_PARAMS.SUBMISSION_ID, RUN_QUERY_PARAMS.BUNDLE, RUN_QUERY_PARAMS.TEST_NAME, 
  RUN_QUERY_PARAMS.RESULT, RUN_QUERY_PARAMS.STATUS, RUN_QUERY_PARAMS.TAGS
];

export default function TestRunsTabs({ requestorNamesPromise, resultsNamesPromise}: TestRunsTabProps) {
  const translations = useTranslations("TestRunsTabs");
  const router = useRouter();
  const pathname = usePathname();
  const rawSearchParams = useSearchParams();

  // Decode the search params from the URL every time the searchParams change
  const searchParams = useMemo(() => {
    const encodedQueryString = rawSearchParams.get('q');
    if (encodedQueryString) {
      const decodedQueryString = decodeStateFromUrlParam(encodedQueryString);
      console.log("Decoded query string:", decodedQueryString);
      if (decodedQueryString) {
        return new URLSearchParams(decodedQueryString);
      }
    }
    return rawSearchParams;
  }, [rawSearchParams]);

  // Initialize selectedIndex based on URL parameters or default to first tab
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const tabParam = searchParams.get("tab");
    const initialIndex = tabParam ? TABS_IDS.indexOf(tabParam) : -1;
    return initialIndex !== -1 ? initialIndex : 0;
  });

  // Initialize selectedVisibleColumns  based on URL parameters or default values
  const [selectedVisibleColumns, setSelectedVisibleColumns] = useState<string[]>(
    () => searchParams.get(RUN_QUERY_PARAMS.VISIBLE_COLUMNS)?.split(',') || [
      COLUMNS_IDS.SUBMITTED_AT,
      COLUMNS_IDS.TEST_RUN_NAME,
      COLUMNS_IDS.REQUESTOR,
      COLUMNS_IDS.TEST_NAME,
      COLUMNS_IDS.STATUS,
      COLUMNS_IDS.RESULT,
    ]
  );

  // Initialize columnsOrder based on URL parameters or default to RESULTS_TABLE_COLUMNS
  const [columnsOrder, setColumnsOrder] = useState<{ id: string; columnName: string }[]>(() => {
    const orderParam = searchParams.get(RUN_QUERY_PARAMS.COLUMNS_ORDER);
    let correctOrder = RESULTS_TABLE_COLUMNS;

    // Parse the order from the URL parameter
    if (orderParam) {
      correctOrder = orderParam.split(',')
        .map(id => RESULTS_TABLE_COLUMNS.find(col => col.id === id))
        .filter(Boolean) as { id: string; columnName: string }[];
    }

    return correctOrder;
  });

  // Initialize timeframe values based on URL parameters or default to last 24 hours
  const [timeframeValues, setTimeframeValues] = useState<TimeFrameValues>(() => {
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const initialToDate = toParam ? new Date(toParam) : new Date();
    const initialFromDate = fromParam ? new Date(fromParam) : new Date(initialToDate.getTime() - DAY_MS);
    return calculateSynchronizedState(initialFromDate, initialToDate);
  });

  // Initialize search criteria based on URL parameters
  const [searchCriteria, setSearchCriteria] = useState<Record<string, string>>(() => {
    const criteria: Record<string, string> = {};
    SEARCH_CRITERIA_KEYS.forEach(key => {
      if (searchParams.has(key)) {
        criteria[key] = searchParams.get(key) || '';
      }
    });
    return criteria;
  });
    
  // State to track if the component has been initialized
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {setIsInitialized(true);}, []);

  // Define the tabs with their corresponding labels, memoized to avoid unnecessary re-renders
  const TABS_CONFIG: TabConfig[] = useMemo(() => [
    { id: TABS_IDS[0], label: translations('tabs.timeframe') },
    { id: TABS_IDS[1], label: translations('tabs.tableDesign') },
    { id: TABS_IDS[2], label: translations('tabs.searchCriteria') },
    { id: TABS_IDS[3], label: translations('tabs.results') },
  ], [translations]);

  // Save and encode current state to the URL. This is the single source of truth for URL updates.
  useEffect(() => {
    if (!isInitialized) return;

    // Build the query string from the current state
    const params = new URLSearchParams();

    // Tab
    params.set(RUN_QUERY_PARAMS.TAB, TABS_CONFIG[selectedIndex].id);

    // Table Design
    if(selectedVisibleColumns.length > 0) {
      params.set(RUN_QUERY_PARAMS.VISIBLE_COLUMNS, selectedVisibleColumns.join(","));
    } else {
      // If no columns are selected, we can clear the parameter
      params.delete(RUN_QUERY_PARAMS.VISIBLE_COLUMNS);
    }
    params.set(RUN_QUERY_PARAMS.COLUMNS_ORDER, columnsOrder.map(col => col.id).join(","));

    // Timeframe
    params.set(RUN_QUERY_PARAMS.FROM, timeframeValues.fromDate.toISOString());
    params.set(RUN_QUERY_PARAMS.TO, timeframeValues.toDate.toISOString());

    // Search Criteria
    Object.entries(searchCriteria).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        // Remove empty criteria
        params.delete(key);
      }
    });

    // Encode the URL parameters to shorten the URL
    const encodedQuery = encodeStateToUrlParam(params.toString());
    console.log("Encoded query:", encodedQuery);
    if (encodedQuery) {
      router.replace(`${pathname}?q=${encodedQuery}`, { scroll: false });
    } else {
      // If there are no params, clear the URL.
      router.replace(pathname, { scroll: false });
    }
  }, [selectedVisibleColumns, columnsOrder, isInitialized, pathname, router, selectedIndex, searchParams, timeframeValues,searchCriteria, TABS_CONFIG]);

  const handleTabChange = (event: {selectedIndex : number}) => {
    const currentIndex = event.selectedIndex;
    setSelectedIndex(currentIndex);
  };

  // Create a canonical query key based on the search parameters so that it won't refetch unnecessarily
  const queryKey = useMemo(() => {
    // Parameters that actually affect the data fetch
    const relevantParameters = [
      RUN_QUERY_PARAMS.FROM, RUN_QUERY_PARAMS.TO, RUN_QUERY_PARAMS.RUN_NAME, RUN_QUERY_PARAMS.REQUESTOR, RUN_QUERY_PARAMS.GROUP,
      RUN_QUERY_PARAMS.SUBMISSION_ID, RUN_QUERY_PARAMS.BUNDLE, RUN_QUERY_PARAMS.TEST_NAME, RUN_QUERY_PARAMS.RESULT, RUN_QUERY_PARAMS.STATUS, RUN_QUERY_PARAMS.TAGS
    ];

    // Create a new URLSearchParams object with the data that actually affects data fetch
    const canonicalParams: Record<string, string> = {};
    for (const key of relevantParameters) {
      if (searchParams.has(key)) {
        let value = searchParams.get(key) || '';

        // Normalize order-independent parameters
        if (key === RUN_QUERY_PARAMS.TAGS ||
            key === RUN_QUERY_PARAMS.RESULT || 
            key === RUN_QUERY_PARAMS.STATUS || 
            key === RUN_QUERY_PARAMS.REQUESTOR) {
          value = value?.split(',').sort().join(',');
        }

        canonicalParams[key] = value;
      }
    }
    
    return ['testRuns', canonicalParams];
  }, [searchParams]);

  const {data: runsData, isLoading, isError } = useQuery<TestRunsData>({
    // Cache data based on search parameters
    queryKey: queryKey,
    queryFn: async () => {
      const response = await fetch(`/internal-api/test-runs?${searchParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch test runs');
      }
      
      return response.json() as Promise<TestRunsData>;
    },
    // Only run the query when the results tab is selected
    enabled: selectedIndex === TABS_IDS.indexOf('results'), 
    // Only refetch when the canonical query key changes
    staleTime: Infinity,
  });

  return (
    <Tabs 
      className={styles.tabs}
      selectedIndex={selectedIndex}
      onChange={handleTabChange}
    >
      <TabList scrollDebounceWait={200} aria-label="Test Runs Tabs">
        {TABS_CONFIG.map((tab) => (
          <Tab key={tab.label}>{tab.label}</Tab>
        ))}
      </TabList>
      <TabPanels>
        <TabPanel>
          <div className={styles.tabContent}>
            <TimeframeContent values={timeframeValues} setValues={setTimeframeValues}/>
          </div>
        </TabPanel>
        <TabPanel>
          <div className={styles.tabContent}>
            <TableDesignContent
              selectedRowIds={selectedVisibleColumns}
              setSelectedRowIds={setSelectedVisibleColumns}
              tableRows={columnsOrder}
              setTableRows={setColumnsOrder}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div className={styles.tabContent}>
            <SearchCriteriaContent
              requestorNamesPromise={requestorNamesPromise}
              resultsNamesPromise={resultsNamesPromise}
              searchCriteria={searchCriteria}
              setSearchCriteria={setSearchCriteria}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div className={styles.tabContent}>
            <TestRunsTable
              runsList={runsData?.runs || []}
              limitExceeded={runsData?.limitExceeded ?? false}
              visibleColumns={selectedVisibleColumns}
              orderedHeaders={columnsOrder}
              isLoading={isLoading}
              isError={isError}
            />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import React from 'react';
import TestRunDetails from '@/components/runs/TestRunDetails';
import { createAuthenticatedApiConfiguration } from '@/utils/api';
import { ArtifactIndexEntry, ResultArchiveStoreAPIApi, Run } from '@/generated/galasaapi';

// Define an interface for the component's props
interface TestRunProps {
  params: {
    slug: string;
  };
}

// Make the component async
export default async function TestRunsPage ({ params: { slug } }: TestRunProps) {

  const apiConfig = createAuthenticatedApiConfiguration();

  const fetchRunDetailsFromApiServer = async () => {
    let runDetails: Run = {};
    const rasApiClient = new ResultArchiveStoreAPIApi(apiConfig);
    const rasRunsResponse = await rasApiClient.getRasRunById(slug);
    
    if(rasRunsResponse) {
      runDetails = structuredClone(rasRunsResponse);
    }
    return runDetails;
  };

  const fetchRunDetailLogs = async () => {
    const rasApiClient = new ResultArchiveStoreAPIApi(apiConfig);
    const rasRunLogsResponse = await rasApiClient.getRasRunLog(slug);
    return rasRunLogsResponse;
  };

  const fetchTestArtifacts = async (): Promise<ArtifactIndexEntry[]> => {
    let runArtifacts: ArtifactIndexEntry[] = [];
    const rasApiClient = new ResultArchiveStoreAPIApi(apiConfig);
    const rasArtifactResponse = await rasApiClient.getRasRunArtifactList(slug);
    
    if (rasArtifactResponse) {
      runArtifacts = structuredClone(Array.from(rasArtifactResponse));
    }
    
    return runArtifacts;
  };

  // Await all the data
  const runDetails = await fetchRunDetailsFromApiServer();
  const runArtifacts = await fetchTestArtifacts();
  const runLogs = await fetchRunDetailLogs();

  return (
    <TestRunDetails 
      runId={slug} 
      runDetails={runDetails}
      runArtifacts={runArtifacts} 
      runLog={runLogs}
    />
  );
};
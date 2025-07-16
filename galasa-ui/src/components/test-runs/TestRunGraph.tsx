/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
"use client";

import "@carbon/charts/styles.css";
import { ScatterChart } from "@carbon/charts-react";
import { Loading, InlineNotification } from "@carbon/react";
import { ScaleTypes } from "@carbon/charts";
import { useMemo } from "react";

import styles from "@/styles/TestRunsGraph.module.css";
import { runStructure, ColumnDefinition } from "@/utils/interfaces";
import { useTranslations } from "next-intl";
import { MAX_RECORDS } from "@/utils/constants/common";
import { useTheme } from "@/contexts/ThemeContext";

interface GraphsProps {
  runsList: runStructure[];
  limitExceeded: boolean;
  visibleColumns?: string[];
  orderedHeaders?: ColumnDefinition[];
  isLoading?: boolean;
  isError?: boolean;
}

export default function TestRunGraph({
  runsList,
  limitExceeded,
  visibleColumns = [],
  orderedHeaders = [],
  isLoading,
  isError,
}: GraphsProps) {
  const translations = useTranslations("TestRunGraph");
  const theme=useTheme();
  const isLight = theme?.theme === "light"; 

  const headers = useMemo(() => {
    return orderedHeaders
      ?.filter((col) => visibleColumns.includes(col.id))
      .map((col) => ({
        key: col.id,
        header: translations(col.id),
      })) || [];
  }, [orderedHeaders, visibleColumns]);

  const colorMap: Record<string, string> = {
    passed: "#24a148",
    failed: "#da1e28",
    other: "#f1c21b",
  };

  const chartData = useMemo(() => {
    const dateMap: Record<string, number> = {};
    return runsList.map((run) => {
      const date = new Date(run.submittedAt);
      const dateKey = date.toISOString().split("T")[0];
      const count = (dateMap[dateKey] || 0) + 1;
      dateMap[dateKey] = count;

      return {
        group: run.result?.toLowerCase() || "other",
        date,
        value: count,
        custom: run,
      };
    });
  }, [runsList]);

  const options = useMemo(() => ({
    theme: isLight ? "white" : "g100",
    axes: {
      bottom: {
        title: translations("submittedAt"),
        mapsTo: "date",
        scaleType: ScaleTypes.TIME,
      },
      left: {
        title: "",
        mapsTo: "value",
        scaleType: ScaleTypes.LINEAR,
        ticks: { values: [1] },
        visible: false,
      },
    },
    height: "400px",
    points: {
      radius: 5,
      fillOpacity: 1,
    },
  
    color: {
      scale: colorMap,
    },
    tooltip: {
      enabled: true,
      customHTML: (dataPoint: any) => {
        const run = dataPoint[0]?.custom || {};
    
        const headersToUse = orderedHeaders?.length
          ? orderedHeaders.filter((col) => visibleColumns.includes(col.id)).map((col) => ({
            key: col.id,
            header: translations(col.id),
          }))
          : visibleColumns.map((key) => ({
            key,
            header: translations(key),
          }));
    
        return `
          <div style="padding: 6px 8px; font-size: 0.9rem;">
            ${headersToUse
      .map(({ key, header }) => `<strong>${header}:</strong> ${run[key] ?? "Unknown"}`)
      .join("<br/>")}
          </div>
        `;
      },
    },     
    legend: {
      alignment: "center",
    },
    data: {
      loading: isLoading,
    },
    experimental: true,
    toolbar: {
      enabled: false,
    },
  }), [headers, isLoading,isLight]);

  if (isError) return <p>{translations("errorLoadingGraph")}</p>;
  if (isLoading) {
    return (
      <div className={styles.spinnerWrapper}>
        <Loading withOverlay={false} description="Loading graph..." />
      </div>
    );
  }
  if (!runsList.length) return <p>{translations("noTestRunsFound")}</p>;

  const earliest = new Date(Math.min(...runsList.map((r) => new Date(r.submittedAt).getTime())));
  const latest = new Date(Math.max(...runsList.map((r) => new Date(r.submittedAt).getTime())));

  return (
    <div className={styles.resultsPageContainer}>
      {limitExceeded && (
        <InlineNotification
          className={styles.notification}
          kind="warning"
          title={translations("limitExceeded.title")}
          subtitle={translations("limitExceeded.subtitle", { MAX_RECORDS })}
        />
      )}
      <p className={styles.timeFrameText}>
        {translations("timeFrameText.range", {
          from: earliest.toLocaleString().replace(",", ""),
          to: latest.toLocaleString().replace(",", ""),
        })}
      </p>
      <ScatterChart data={chartData} options={options} />
    </div>
  );
}
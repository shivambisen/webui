"use client";
/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { ArtifactIndexEntry } from '@/generated/galasaapi';
import { TreeView, TreeNode, InlineLoading, InlineNotification } from '@carbon/react';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/Artifacts.module.css';
import { CloudDownload, Document, Folder, Zip } from '@carbon/icons-react';
import { downloadArtifactFromServer } from '@/actions/runsAction';
import { Tile } from '@carbon/react';

interface FileNode {
  name: string;
  runId: string;
  url: string;
  isFile: true;
  children: {};
}

interface FolderNode {
  name: string;
  isFile: false;
  children: { [key: string]: TreeNodeData };
}

type TreeNodeData = FileNode | FolderNode;

export type DownloadResult =
  | { contentType: 'application/json'; data: any; size: number; base64: string; }
  | { contentType: 'text/plain'; data: string; size: number; base64: string; }
  | { contentType: string; data: string; size: number; base64: string; };


export function ArtifactsTab({ artifacts, runId, runName }: { artifacts: ArtifactIndexEntry[], runId: string, runName: string }) {

  const [treeData, setTreeData] = useState<FolderNode>({
    name: '',
    isFile: false,
    children: {},
  });

  const [artifactFile, setArtifactFile] = useState("");
  const [fileSize, setFileSize] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [base64Data, setBase64Data] = useState<string>("");
  const [contentType, setContentType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function formatFileSize(bytes: number) {
    if (bytes < 10000) {
      setFileSize(`${bytes} bytes`);
    } else {
      const mb = bytes / (1024 * 1024);
      setFileSize(`${mb.toFixed(2)} MB`);
    }
  }

  const handleDownloadClick = () => {
    if (!base64Data) return;

    // (a) Turn Base64 string → binary string
    const binaryString = atob(base64Data);
    // (b) Convert binary string → Uint8Array
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // (c) Create a Blob from that Uint8Array with the correct MIME type
    const blob = new Blob([bytes]);

    // (d) Create a temporary URL and “click” a hidden <a> to download it
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // name (e.g. “myfile.json” or “notes.txt”)
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // (e) Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(url);
  };


  const downloadArtifact = async (runId: string, artifactUrl: string) => {

    setLoading(true);
    setError(null);

    try {

      const result: DownloadResult = await downloadArtifactFromServer(runId, artifactUrl);
      setFileName(artifactUrl);

      // result.data is either:
      //  • a JS object (if JSON), or
      //  • a string (if text/plain or something else)

      if (result.contentType.includes('application/json')) {
        setArtifactFile(result.data);
      } else {
        setArtifactFile(result.data as string); // (plain string)
      }

      setContentType(result.contentType);
      formatFileSize(result.size);
      setBase64Data(result.base64);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }

  };

  function renderArtifactContent(artifactFile: string, contentType: string) {
    // 1) Nothing selected
    if (!artifactFile) {
      return <p>Select a file to display its content</p>;
    }

    // 2) Plain-text (or any text/* MIME)
    if (contentType.startsWith("text/")) {
      return <pre>{artifactFile}</pre>;
    }

    // 3) JSON (or JS object)
    if (
      contentType.includes("json") ||
      typeof artifactFile === "object"
    ) {
      // if it’s a string, try to parse it first
      let data = artifactFile;
      if (typeof artifactFile === "string") {
        try {
          data = JSON.parse(artifactFile);
        } catch {
          // leave it as the raw string if parse fails
        }
      }
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }

    // 4) Binary (zip, images, etc.)
    return (
      <p>
        This is a binary file ({contentType}), please download it to see its content.
      </p>
    );
  }


  useEffect(() => {
    // Build the root node, which holds top-level folders and files
    const root: FolderNode = { name: '', isFile: false, children: {} };

    artifacts.forEach((artifact) => {
      // 1) Get the raw path string, default to empty if undefined
      const rawPath = artifact.path ?? '';
      // 2) Remove a leading "/" or "./" if present
      const cleaned = rawPath.replace(/^\.?\//, '');
      // 3) Split into segments and drop any empty strings
      let segments = cleaned.split('/').filter((seg) => seg !== '');

      // 4) If the first segment is "artifact" or "artifacts", drop it so that
      //    "artifact/framework" becomes ["framework", ...]
      if (segments[0]?.toLowerCase() === 'artifact' || segments[0]?.toLowerCase() === 'artifacts') {
        segments = segments.slice(1);
      }

      // If there are no segments left, skip this artifact
      if (segments.length === 0) {
        return;
      }

      let currentNode: FolderNode = root;

      segments.forEach((segment, idx) => {
        const isLast = idx === segments.length - 1;

        if (isLast) {
          // It’s a file: insert a FileNode under currentNode.children
          currentNode.children[segment] = {
            name: segment,
            runId: artifact.runId ?? '',
            url: artifact.path ?? '',
            isFile: true,
            children: {},
          };
        } else {
          // It’s a folder: create or reuse a FolderNode
          const existing = currentNode.children[segment];

          if (!existing) {
            // Create new folder if it doesn’t exist
            currentNode.children[segment] = {
              name: segment,
              isFile: false,
              children: {},
            };
            currentNode = currentNode.children[segment] as FolderNode;
          } else if (existing.isFile) {
            // Conflict: a file was created here before. Replace it with a folder.
            currentNode.children[segment] = {
              name: segment,
              isFile: false,
              children: {},
            };
            currentNode = currentNode.children[segment] as FolderNode;
          } else {
            // Descend into existing folder
            currentNode = existing as FolderNode;
          }
        }
      });
    });

    setTreeData(root);
  }, [artifacts]);

  // Recursive renderer: emits a <TreeNode> for each TreeNodeData
  const renderNode = (node: TreeNodeData, path: string) => {
    if (node.isFile) {
      // Leaf file node
      return (
        <TreeNode
          key={path}
          id={path}
          renderIcon={path.endsWith(".gz") ? Zip : Document}
          label={node.name}
          value={node.name}
          onSelect={() => downloadArtifact(runId, node.url)}
        />
      );
    } else {
      // Folder node: render label, then recurse on children
      return (
        <TreeNode isExpanded={false} key={path} id={path} label={node.name} value={node.name} renderIcon={Folder}>
          {Object.values(node.children).map((child) => {
            const childPath = path ? `${path}/${child.name}` : child.name;
            return renderNode(child, childPath);
          })}
        </TreeNode>
      );
    }
  };

  return (
    <>
      <div className={styles.titleContainer}>
        <h3>Artifacts</h3>
        <p>An artifact is some captured state left behind once a Run has completed. Artifacts can be downloaded and viewed.</p>
      </div>
      <div className={styles.artifact}>

        <TreeView className={styles.tree} onSelect={() => { }}>
          {Object.values(treeData.children).map((child) =>
            renderNode(child, child.name)
          )}
        </TreeView>

        <div className={styles.artifactView}>

          {loading && <InlineLoading description="Downloading Artifact" iconDescription="Downloading Artifact" />}
          {error && <InlineNotification statusIconDescription="notification" kind="error" title="Something went wrong" subtitle={`There was an error downloading the artifact. It may be that the artifact is too big for this web application, try refreshing the page or downloading the test run using the 'galasactl' command-line tool.\nFor example:\ngalasactl runs download --name ${runName}`} />}

          {
            !loading && !error && (
              <div>

                <div>
                  {artifactFile !== "" &&
                    <Tile className={styles.toolbar}>
                      <div>
                        <h5>{fileName}</h5>
                        <p className={styles.fileSize}>
                          {fileSize}
                        </p>
                      </div>
                      <div className={styles.toolbarOptions}>
                        <button type="button" onClick={handleDownloadClick} className={styles.downloadButton}>
                          <CloudDownload size={22} color='#0043ce' />
                        </button>
                      </div>
                    </Tile>
                  }
                </div>

                <pre className={styles.fileRenderer}>
                  {renderArtifactContent(artifactFile, contentType)}
                </pre>
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}

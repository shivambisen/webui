/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
"use client";
import { User, UserData } from '@/generated/galasaapi';
import React, { useEffect, useState } from 'react';
import { Loading } from "@carbon/react";
import { Table, TableHead, TableRow, TableBody, TableCell, TableHeader, DataTableCell,TableContainer, TableToolbarSearch,TableToolbarContent} from '@carbon/react';
import styles from "@/styles/UsersList.module.css";
import { DataTable } from '@carbon/react';
import ErrorPage from '@/app/error/page';

export const dynamic = "force-dynamic";

interface UsersListSectionProps {
  usersListPromise: Promise<UserData[]>;
}

interface IUser {
  id: string;
  loginId: string;
  role: string;
  lastLogin: Date | string;
  lastAccessTokenUse: Date | string;
}

function UsersList({ usersListPromise }: UsersListSectionProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [users, setUsers] = useState<any>([]);

  const headers = [

    // headers we want to show in the data table
    // keys should match with the prop name in the interface

    {
      key: "loginId",
      header: "Login ID"
    },
    {
      key: "role",
      header: "Role"
    },
    {
      key: "lastLogin",
      header: "Last login"
    },
    {
      key: "lastAccessTokenUse",
      header: "Last access token use"
    },
  ];

  const flattenUserDataForTable = async (users: UserData[]) => {

    // We have to flatten out the data so that the carbon DataTable component can
    // render data in rows / cells

    return users.map((user) => ({
      id: user.id,
      loginId: user.loginId,
      role: user.synthetic?.role?.metadata?.name || "n/a",
      lastLogin:
        user.clients && user.clients.length > 0 && user.clients[0].lastLogin
          ? new Date(user.clients[0].lastLogin).toLocaleDateString("en-GB") // use the British date format (DD/MM/YYYY)
          : "n/a",
      lastAccessTokenUse:
        user.clients && user.clients.length > 1 && user.clients[1].lastLogin
          ? new Date(user.clients[1].lastLogin).toLocaleDateString("en-GB")
          : "n/a"
    }));

  };

  useEffect(() => {

    const loadUsers = async () => {

      setIsLoading(true);

      try {

        const users = await usersListPromise;
        if (users) {
          let flattenedUsers = await flattenUserDataForTable(users);
          setUsers(flattenedUsers);
        }

      } catch (err) {
        setIsError(false);
      } finally {
        setIsLoading(false);
      }

    };

    loadUsers();

  }, [usersListPromise]);

  if (isLoading) {
    return <Loading />;
  }

  if(isError){
    return <ErrorPage />;
  }

  return (
    <div className={styles.userListContainer}>

      <h3 className="margin-y-1">Users</h3>

      <DataTable isSortable rows={users} headers={headers}>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getTableProps,
          onInputChange
        }: {
          rows: any[];
          headers: any[];
          getHeaderProps: (options: any) => any;
          getRowProps: (options: any) => any;
          getTableProps: () => any;
          onInputChange: () => any;
        }) => (
          <TableContainer>
            <TableToolbarContent>
              <TableToolbarSearch placeholder="Search" persistent onChange={onInputChange} />
            </TableToolbarContent>
            <Table {...getTableProps()} aria-label="users table" size="lg">
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader key={header.key} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell: any) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))
                    }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

    </div>
  );
}

export default UsersList;
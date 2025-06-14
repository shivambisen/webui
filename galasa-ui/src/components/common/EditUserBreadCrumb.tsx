/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

'use client';

import React from 'react';
import { Breadcrumb, BreadcrumbItem, Theme } from "@carbon/react";
import "@/styles/global.scss";
import styles from "@/styles/BreadCrumb.module.css";
import { useTranslations } from 'next-intl';

export default function EditUserBreadCrumb() {
  const t = useTranslations('EditUserBreadCrumb');

  return (
    <Theme theme="g10">
      <Breadcrumb className={styles.crumbContainer}>
        <BreadcrumbItem isCurrentPage={false} href="/">{t("home")}</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage={false} href="/users">{t("users")}</BreadcrumbItem>
      </Breadcrumb>
    </Theme>
  );
}

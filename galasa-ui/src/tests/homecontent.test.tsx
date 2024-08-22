/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import { render, screen } from '@testing-library/react';
import React from 'react';
import HomeContent from '@/components/HomeContent';


test("render home content title", () => {

    render(<HomeContent />)

    const title = screen.getByText("Welcome to your Galasa Service")

    expect(title).toBeInTheDocument()
})

test("render home content sub-title", () => {

    render(<HomeContent />)

    const subTitle = screen.getByText("Get the most from your Galasa experience by reading the Galasa documentation")

    expect(subTitle).toBeInTheDocument()
})

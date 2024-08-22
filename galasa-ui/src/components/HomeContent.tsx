/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client'
import Image from "next/image";
import homeGraphic from "../assets/images/homeGraphic.png"
import { Heading, Section } from "@carbon/react"
import "../styles/global.scss"
import styles from "../styles/HomeContent.module.css"

export default function HomeContent() {

    return (
        <Section level={1}>
            <div className={styles.homeContentWrapper}>
                <Heading>Welcome to your Galasa Service</Heading>
                <Section level={2}>
                    <h4>Get the most from your Galasa experience by reading the Galasa documentation &nbsp;
                        <a href="https://galasa.dev/" target="_blank">here</a>
                    </h4>
                </Section>
                <Image className={styles.heroImage} src={homeGraphic} alt='home-graphic'></Image>
            </div>
        </Section>
    )

}
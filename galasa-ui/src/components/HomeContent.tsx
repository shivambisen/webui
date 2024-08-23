/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client'
import Image from "next/image";
import homeGraphic from "../../public/static/homeGraphic.png"
import { Heading, Section } from "@carbon/react"
import styles from "../styles/HomeContent.module.css"
import Link from "next/link";

export default function HomeContent() {

    return (
        <Section level={1}>
            <div className={styles.homeContentWrapper}>
                <Heading>Welcome to your Galasa Service</Heading>
                <Section level={2}>
                    <h4>Get the most from your Galasa experience by reading the 
                        <Link href="https://galasa.dev/" target="_blank" rel="noopener noreferrer"> Galasa documentation</Link>
                    </h4>
                </Section>
                <Image className={styles.heroImage} src={homeGraphic} width={680} height={680} alt='home-graphic'></Image>
            </div>
        </Section>
    )

}
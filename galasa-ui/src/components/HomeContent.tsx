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
import { useEffect, useState } from "react";
import MarkdownIt from 'markdown-it';

export default function HomeContent() {

    const [markdownContent, setMarkdownContent]: any = useState()
    const [isError, setIsError] = useState(false)

    let md = new MarkdownIt();

    const fetchHomeTitleFromCps = async () => {

        try{
            const response = await fetch("/home", { method: "GET" });

            if (response.ok) {
    
                let markdownFileContent = await response.text();
    
                if(markdownFileContent.length >= 64){
                    markdownFileContent = markdownFileContent.substring(0, 64) + "..."
                }
    
                let result = md.render(markdownFileContent)

                setMarkdownContent(result)
            }
        }catch(err){
            setIsError(true)
        }
    }

    useEffect(() => {
        fetchHomeTitleFromCps()
    }, [])

    return (
        <Section level={1}>
            <div className={styles.homeContentWrapper}>
                {
                    markdownContent ? (
                        <div dangerouslySetInnerHTML={{ __html: markdownContent }} />
                    ) : (
                        <Section>
                            <Heading>Welcome to your Galasa Service</Heading>
                            <Section level={2}>
                                <h4>
                                    Get the most from your Galasa experience by reading the
                                    <Link className={styles.link} href="https://galasa.dev/" target="_blank" rel="noopener noreferrer"> Galasa documentation.</Link>
                                </h4>
                            </Section>
                        </Section>
                    )
                }
                <Image className={styles.heroImage} src={homeGraphic} width={680} height={680} alt='home-graphic'></Image>
            </div>
        </Section>
    )

}
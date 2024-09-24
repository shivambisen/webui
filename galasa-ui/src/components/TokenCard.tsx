/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client'

import { useState } from "react";
import styles from "../styles/TokenCard.module.css"
import { Password } from '@carbon/icons-react';
import { SelectableTile } from '@carbon/react';

function TokenCard({tokenId, tokenDescription, createdAt, owner, handleSelectTokensForDeletion} : {tokenId:string , tokenDescription : string, createdAt : string, owner :string, handleSelectTokensForDeletion : any}){

    const trimmedTime = createdAt.split("T")

    return(

        <SelectableTile onClick={() => handleSelectTokensForDeletion(tokenId)} value={true} key={tokenId} className={styles.cardContainer}>

            <h5>{tokenDescription}</h5>
            <div className={styles.infoContainer}>

                <h6>Created at: {trimmedTime[0]}</h6>
                <h6>Owner: {owner}</h6>
                
            </div>

            <Password className={styles.icon} size={40}/>

        </SelectableTile>
        
    )

}

export default TokenCard
// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'
import { RelationshipsBetweenSPDXElements } from '@/object-types'
import CommonUtils from '@/utils/common.utils'
import { useState } from 'react'
import styles from '../../detail.module.css'

interface Props {
    indexRelation?: number
    setIndexRelation?: React.Dispatch<React.SetStateAction<number>>
    relationshipsBetweenSPDXElementSPDXs: RelationshipsBetweenSPDXElements[]
    setRelationshipsBetweenSPDXElementSPDXs: React.Dispatch<React.SetStateAction<RelationshipsBetweenSPDXElements[]>>
    relationshipsBetweenSPDXElementPackages: RelationshipsBetweenSPDXElements[]
    setRelationshipsBetweenSPDXElementPackages: React.Dispatch<React.SetStateAction<RelationshipsBetweenSPDXElements[]>>
}

const RelationshipbetweenSPDXElementsInformation = ({
    indexRelation,
    setIndexRelation,
    relationshipsBetweenSPDXElementSPDXs,
    setRelationshipsBetweenSPDXElementSPDXs,
    relationshipsBetweenSPDXElementPackages,
    setRelationshipsBetweenSPDXElementPackages,
}: Props) => {
    const [toggle, setToggle] = useState(false)
    const [isSourceSPDXDocument, setIsSourceSPDXDocument] = useState<boolean>(true)
    const [changeSource, setChangeSource] = useState(false)

    const changeRelationshipSource = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setChangeSource(true)
        setIndexRelation(0)
        const relationshipType: string = e.target.value
        if (relationshipType === 'spdxDoucument') {
            setIsSourceSPDXDocument(true)
            if (!CommonUtils.isNullEmptyOrUndefinedArray(relationshipsBetweenSPDXElementSPDXs)) {
                setRelationshipsBetweenSPDXElementSPDXs(relationshipsBetweenSPDXElementSPDXs)
            } else {
                setRelationshipsBetweenSPDXElementSPDXs([])
            }
        } else if (relationshipType === 'package') {
            setIsSourceSPDXDocument(false)
            if (!CommonUtils.isNullEmptyOrUndefinedArray(relationshipsBetweenSPDXElementPackages)) {
                setRelationshipsBetweenSPDXElementPackages(relationshipsBetweenSPDXElementPackages)
            } else {
                setRelationshipsBetweenSPDXElementPackages([])
            }
        }
    }

    const displayIndex = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setChangeSource(false)
        const index: string = e.target.value
        setIndexRelation(parseInt(index))
    }

    return (
        <table className={`table label-value-table ${styles['summary-table']}`}>
            <thead
                title='Click to expand or collapse'
                onClick={() => {
                    setToggle(!toggle)
                }}
            >
                <tr>
                    <th colSpan={2}>11. Relationship between SPDX Elements Information</th>
                </tr>
            </thead>
            <tbody hidden={toggle}>
                <tr>
                    <td className='spdx-label-index'>Source</td>
                    <td className='spdx-flex-row' style={{ height: '50.5px' }}>
                        <select
                            id='relationshipSourceSelect'
                            className='spdx-col-2'
                            onChange={changeRelationshipSource}
                        >
                            <option value='spdxDoucument'>SPDX Document</option>
                            <option value='package'>Package</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td className='spdx-label-index'>Index</td>
                    <td style={{ height: '50.5px' }}>
                        <select
                            id='relationshipSelect'
                            className='spdx-col-2'
                            onChange={displayIndex}
                            style={{ width: '100%' }}
                            value={changeSource ? 0 : indexRelation}
                            disabled={
                                isSourceSPDXDocument
                                    ? CommonUtils.isNullEmptyOrUndefinedArray(relationshipsBetweenSPDXElementSPDXs)
                                    : CommonUtils.isNullEmptyOrUndefinedArray(relationshipsBetweenSPDXElementPackages)
                            }
                        >
                            {isSourceSPDXDocument
                                ? relationshipsBetweenSPDXElementSPDXs.map((item) => (
                                      <option key={item.index} value={item.index}>
                                          {item.index + 1}
                                      </option>
                                  ))
                                : relationshipsBetweenSPDXElementPackages.map((item) => (
                                      <option key={item.index} value={item.index}>
                                          {item.index + 1}
                                      </option>
                                  ))}
                        </select>
                    </td>
                </tr>

                {(isSourceSPDXDocument
                    ? relationshipsBetweenSPDXElementSPDXs[indexRelation]
                    : relationshipsBetweenSPDXElementPackages[indexRelation]) && (
                    <>
                        <tr className='relationship-document'>
                            <td>11.1 Relationship</td>
                            <td>
                                <div className='spdx-col-2 spdx-flex-col'>
                                    <div className='spdx-flex-row'>
                                        <div className='spdx-col-1 '>
                                            {isSourceSPDXDocument
                                                ? relationshipsBetweenSPDXElementSPDXs[indexRelation]?.spdxElementId
                                                : relationshipsBetweenSPDXElementPackages[indexRelation]
                                                      ?.spdxElementId ?? ''}
                                        </div>
                                        <div className='spdx-col-1 spdx-flex-row'>
                                            {isSourceSPDXDocument
                                                ? relationshipsBetweenSPDXElementSPDXs[indexRelation]?.relationshipType
                                                : relationshipsBetweenSPDXElementPackages[
                                                      indexRelation
                                                  ]?.relationshipType.replace('relationshipType_', '') ?? ''}
                                        </div>
                                        <div className='spdx-col-3'>
                                            {isSourceSPDXDocument
                                                ? relationshipsBetweenSPDXElementSPDXs[indexRelation]
                                                      ?.relatedSpdxElement
                                                : relationshipsBetweenSPDXElementPackages[indexRelation]
                                                      ?.relatedSpdxElement ?? ''}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr className='relationship-document'>
                            <td>11.2 Relationship comment</td>
                            <td>
                                <p className='spdx-col-2'>
                                    {isSourceSPDXDocument
                                        ? relationshipsBetweenSPDXElementSPDXs[indexRelation]?.relationshipComment
                                              .trim()
                                              .split('\n')
                                              .map((item) => {
                                                  return (
                                                      <>
                                                          {item}
                                                          <br></br>
                                                      </>
                                                  )
                                              })
                                        : relationshipsBetweenSPDXElementPackages[indexRelation]?.relationshipComment
                                              .trim()
                                              .split('\n')
                                              .map((item) => {
                                                  return (
                                                      <>
                                                          {item}
                                                          <br></br>
                                                      </>
                                                  )
                                              }) ?? ''}
                                </p>
                            </td>
                        </tr>
                    </>
                )}
            </tbody>
        </table>
    )
}

export default RelationshipbetweenSPDXElementsInformation

// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import {
    Annotations,
    DocumentCreationInformation,
    ExternalDocumentReferences,
    ExternalReference,
    HttpStatus,
    OtherLicensingInformationDetected,
    PackageInformation,
    RelationshipsBetweenSPDXElements,
    ReleaseDetail,
    SPDXDocument,
    SnippetInformation,
    SnippetRange,
} from '@/object-types'
import CommonUtils from '@/utils/common.utils'
import { ApiUtils } from '@/utils/index'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

import AnnotationInformation from './AnnotationInformation'
import styles from './CssButton.module.css'
import DocumentCreationInformationDetail from './DocumentCreationInformation'
import OtherLicensingInformationDetectedDetail from './OtherLicensingInformationDetectedDetail'
import PackageInformationDetail from './PackageInformationDetail'
import RelationshipbetweenSPDXElementsInformation from './RelationshipbetweenSPDXElementsInformation'
import SnippetInformationDetail from './SnippetInformation'

interface Props {
    releaseId: string
}

const SPDXDocumentTab = ({ releaseId }: Props) => {
    const t = useTranslations('default')
    const [spdxDocument, setSPDXDocument] = useState<SPDXDocument>()
    const [documentCreationInformation, setDocumentCreationInformation] = useState<DocumentCreationInformation>()
    const [packageInformation, setPackageInformation] = useState<PackageInformation>()
    const [externalDocumentRef, setExternalDocumentRef] = useState<ExternalDocumentReferences>()
    const [snippetRanges, setSnippetRanges] = useState<SnippetRange[]>([])
    const [externalRefsData, setExternalRefsData] = useState<ExternalReference>()
    const [snippetInformations, setSnippetInformations] = useState<SnippetInformation[]>([])
    const [indexSnippetInformation, setIndexSnippetInformation] = useState(0)
    const [indexOtherLicense, setIndexOtherLicense] = useState(0)
    const [otherLicensingInformationDetecteds, setOtherLicensingInformationDetecteds] = useState<
        OtherLicensingInformationDetected[]
    >([])

    const [indexRelation, setIndexRelation] = useState(0)
    const [relationshipsBetweenSPDXElementSPDXs, setRelationshipsBetweenSPDXElementSPDXs] = useState<
        RelationshipsBetweenSPDXElements[]
    >([])
    const [relationshipsBetweenSPDXElementPackages, setRelationshipsBetweenSPDXElementPackages] = useState<
        RelationshipsBetweenSPDXElements[]
    >([])

    const [indexAnnotations, setIndexAnnotations] = useState(0)
    const [annotationsSPDXs, setAnnotationsSPDXs] = useState<Annotations[]>([])
    const [annotationsPackages, setAnnotationsPackages] = useState<Annotations[]>([])

    const [isModeFull, setIsModeFull] = useState(true)
    const [toggleOther, setToggleOther] = useState(false)

    const { data: session } = useSession()

    const fetchData = useCallback(
        async (url: string) => {
            const response = await ApiUtils.GET(url, session.user.access_token)
            if (response.status == HttpStatus.OK) {
                const data = (await response.json()) as ReleaseDetail
                return data
            } else if (response.status == HttpStatus.UNAUTHORIZED) {
                return signOut()
            } else {
                return null
            }
        },
        [session]
    )

    useEffect(() => {
        fetchData(`releases/${releaseId}`)
            .then((release: ReleaseDetail) => {
                //SPDX Document
                if (
                    !CommonUtils.isNullOrUndefined(release._embedded) &&
                    !CommonUtils.isNullOrUndefined(release._embedded['sw360:spdxDocument'])
                ) {
                    setSPDXDocument(release._embedded['sw360:spdxDocument'])
                    //SnippetInformation
                    if (!CommonUtils.isNullEmptyOrUndefinedArray(release._embedded['sw360:spdxDocument'].snippets)) {
                        setSnippetInformations(
                            release._embedded['sw360:spdxDocument'].snippets.toSorted((e1, e2) => e1.index - e2.index)
                        )
                        setIndexSnippetInformation(0)
                        if (
                            !CommonUtils.isNullEmptyOrUndefinedArray(
                                release._embedded['sw360:spdxDocument'].snippets[0].snippetRanges
                            )
                        ) {
                            setSnippetRanges(release._embedded['sw360:spdxDocument'].snippets[0].snippetRanges)
                        }
                    }
                    //OtherLicensingInformationDetected
                    if (
                        !CommonUtils.isNullEmptyOrUndefinedArray(
                            release._embedded['sw360:spdxDocument'].otherLicensingInformationDetecteds
                        )
                    ) {
                        setOtherLicensingInformationDetecteds(
                            release._embedded['sw360:spdxDocument'].otherLicensingInformationDetecteds.toSorted(
                                (e1, e2) => e1.index - e2.index
                            )
                        )
                        setIndexOtherLicense(0)
                    }
                    //RelationshipsBetweenSPDXElements
                    if (
                        !CommonUtils.isNullEmptyOrUndefinedArray(release._embedded['sw360:spdxDocument'].relationships)
                    ) {
                        setRelationshipsBetweenSPDXElementSPDXs(
                            release._embedded['sw360:spdxDocument'].relationships.toSorted(
                                (e1, e2) => e1.index - e2.index
                            )
                        )
                        setIndexRelation(0)
                    }
                    //Annotations
                    if (!CommonUtils.isNullEmptyOrUndefinedArray(release._embedded['sw360:spdxDocument'].annotations)) {
                        setIndexAnnotations(0)
                        setAnnotationsSPDXs(
                            release._embedded['sw360:spdxDocument'].annotations.toSorted(
                                (e1, e2) => e1.index - e2.index
                            )
                        )
                    }
                }

                // DocumentCreationInformation
                if (
                    !CommonUtils.isNullOrUndefined(release._embedded) &&
                    !CommonUtils.isNullOrUndefined(release._embedded['sw360:documentCreationInformation'])
                ) {
                    setDocumentCreationInformation(release._embedded['sw360:documentCreationInformation'])
                    // ExternalDocumentRefs
                    if (
                        !CommonUtils.isNullEmptyOrUndefinedArray(
                            release._embedded['sw360:documentCreationInformation'].externalDocumentRefs
                        )
                    ) {
                        setExternalDocumentRef(
                            release._embedded['sw360:documentCreationInformation'].externalDocumentRefs[0]
                        )
                    }
                }

                // PackageInformation
                if (
                    !CommonUtils.isNullOrUndefined(release._embedded) &&
                    !CommonUtils.isNullOrUndefined(release._embedded['sw360:packageInformation'])
                ) {
                    setPackageInformation(release._embedded['sw360:packageInformation'])
                    if (
                        !CommonUtils.isNullEmptyOrUndefinedArray(
                            release._embedded['sw360:packageInformation'].relationships
                        )
                    ) {
                        setIndexRelation(0)
                        setRelationshipsBetweenSPDXElementPackages(
                            release._embedded['sw360:packageInformation'].relationships.toSorted(
                                (e1, e2) => e1.index - e2.index
                            )
                        )
                    }
                    if (
                        !CommonUtils.isNullEmptyOrUndefinedArray(
                            release._embedded['sw360:packageInformation'].annotations
                        )
                    ) {
                        setIndexAnnotations(0)
                        setAnnotationsPackages(
                            release._embedded['sw360:packageInformation'].annotations.toSorted(
                                (e1, e2) => e1.index - e2.index
                            )
                        )
                    }
                    if (
                        !CommonUtils.isNullEmptyOrUndefinedArray(
                            release._embedded['sw360:packageInformation'].externalRefs
                        )
                    ) {
                        setExternalRefsData(release._embedded['sw360:packageInformation'].externalRefs[0])
                    }
                }
            })
            .catch((err) => console.error(err))
    }, [fetchData, releaseId])

    const changeModeFull = () => {
        setIsModeFull(true)
    }

    const changeModeLite = () => {
        setIsModeFull(false)
    }

    return (
        <>
            <div className='list-group-companion' data-belong-to='tab-Attachments'>
                <div className='btn-group'>
                    <button
                        className={`btn ${isModeFull ? styles['btn-full'] : styles['btn-lite']}`}
                        onClick={changeModeFull}
                    >
                        {t('SPDX Full')}
                    </button>
                    <button
                        className={`btn ${isModeFull ? styles['btn-lite'] : styles['btn-full']}`}
                        onClick={changeModeLite}
                    >
                        {t('SPDX Lite')}
                    </button>
                </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
            {isModeFull ? (
                <div className='col'>
                    <DocumentCreationInformationDetail
                        isModeFull={isModeFull}
                        documentCreationInformation={documentCreationInformation}
                        externalDocumentRef={externalDocumentRef}
                        setExternalDocumentRef={setExternalDocumentRef}
                    />
                    <PackageInformationDetail
                        isModeFull={isModeFull}
                        packageInformation={packageInformation}
                        externalRefsData={externalRefsData}
                        setExternalRefsData={setExternalRefsData}
                    />
                    <SnippetInformationDetail
                        spdxDocument={spdxDocument}
                        snippetInformations={snippetInformations}
                        indexSnippetInformation={indexSnippetInformation}
                        setIndexSnippetInformation={setIndexSnippetInformation}
                        setSnippetRanges={setSnippetRanges}
                        snippetRanges={snippetRanges}
                    />
                    <OtherLicensingInformationDetectedDetail
                        toggleOther={toggleOther}
                        setToggleOther={setToggleOther}
                        isModeFull={isModeFull}
                        spdxDocument={spdxDocument}
                        indexOtherLicense={indexOtherLicense}
                        setIndexOtherLicense={setIndexOtherLicense}
                        otherLicensingInformationDetecteds={otherLicensingInformationDetecteds}
                    />
                    <RelationshipbetweenSPDXElementsInformation
                        indexRelation={indexRelation}
                        setIndexRelation={setIndexRelation}
                        relationshipsBetweenSPDXElementSPDXs={relationshipsBetweenSPDXElementSPDXs}
                        setRelationshipsBetweenSPDXElementSPDXs={setRelationshipsBetweenSPDXElementSPDXs}
                        relationshipsBetweenSPDXElementPackages={relationshipsBetweenSPDXElementPackages}
                        setRelationshipsBetweenSPDXElementPackages={setRelationshipsBetweenSPDXElementPackages}
                    />
                    <AnnotationInformation
                        indexAnnotations={indexAnnotations}
                        setIndexAnnotations={setIndexAnnotations}
                        annotationsSPDXs={annotationsSPDXs}
                        setAnnotationsSPDXs={setAnnotationsSPDXs}
                        annotationsPackages={annotationsPackages}
                        setAnnotationsPackages={setAnnotationsPackages}
                    />
                </div>
            ) : (
                <div className='col'>
                    <DocumentCreationInformationDetail
                        isModeFull={isModeFull}
                        documentCreationInformation={documentCreationInformation}
                        externalDocumentRef={externalDocumentRef}
                        setExternalDocumentRef={setExternalDocumentRef}
                    />
                    <PackageInformationDetail
                        isModeFull={isModeFull}
                        packageInformation={packageInformation}
                        externalRefsData={externalRefsData}
                        setExternalRefsData={setExternalRefsData}
                    />
                    <OtherLicensingInformationDetectedDetail
                        toggleOther={toggleOther}
                        setToggleOther={setToggleOther}
                        isModeFull={isModeFull}
                        spdxDocument={spdxDocument}
                        indexOtherLicense={indexOtherLicense}
                        setIndexOtherLicense={setIndexOtherLicense}
                        otherLicensingInformationDetecteds={otherLicensingInformationDetecteds}
                    />
                </div>
            )}
        </>
    )
}

export default SPDXDocumentTab

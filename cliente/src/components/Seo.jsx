/* eslint-disable prettier/prettier */
import React from 'react'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'

const SITE_URL = import.meta.env.VITE_SITE_URL || ''
const SITE_NAME = 'American Shop Vip'
const DEFAULT_IMAGE = `${SITE_URL}/banner_1_home.png`

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  path: PropTypes.string,
  image: PropTypes.string,
  noindex: PropTypes.bool,
  jsonLd: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

export default function Seo({ title, description, path = '', image, noindex = false, jsonLd }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const url = `${SITE_URL}${path}`
  const ogImage = image || DEFAULT_IMAGE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}

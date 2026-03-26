import React from 'react'
import { DefaultTemplate } from '@payloadcms/next/templates'
import type { ServerProps, VisibleEntities } from 'payload'
import SubscribersClient from './SubscribersClient'

type SubscribersViewProps = ServerProps & {
  initPageResult: {
    visibleEntities: VisibleEntities
    [key: string]: unknown
  }
}

const SubscribersView: React.FC<SubscribersViewProps> = ({
  i18n,
  locale,
  params,
  payload,
  permissions,
  searchParams,
  user,
  initPageResult,
}) => {
  return (
    <DefaultTemplate
      i18n={i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user}
      visibleEntities={initPageResult.visibleEntities}
    >
      <SubscribersClient />
    </DefaultTemplate>
  )
}

export default SubscribersView

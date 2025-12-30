export * from './submitDraft'
export * from './publishDraft'
export * from './fetchAllEvents'
export * from './fetchEventForAdmin'
export * from './updateEvent'
export * from './deleteEvent'

export const host = () => `${location.protocol}//${location.host}/api`

//@flow 
import type { ResponseSections } from 'src/api'
import type { SectionsAction } from 'src/actions/sections'

import { groupBy } from 'src/utils'

export type SectionsState = {
  isFetching: boolean;
  items: ResponseSections,
  tree: {},
  lastUpdated?: Date,
  error?: ?string
};

export const defaultSectionsState = {
    isFetching: false,
    items: [],
    tree: {}
}

const sections = (state: SectionsState = defaultSectionsState, action: SectionsAction) => {
    switch (action.type) {
        case 'REQUEST_SECTIONS':
            return {
                ...state,
                isFetching: true
            }
        case 'RECEIVE_SECTIONS':
            return {
                ...state,
                isFetching: false,
                items: action.items,
                tree: groupBy(action.items, 'forum'),
                lastUpdated: action.receivedAt
            }
        default:
            return state
    }
}

export default sections;
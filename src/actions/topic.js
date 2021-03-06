//@flow
import * as API from 'src/api'
import type { Dispatch } from 'redux'

import type { ResponseInfo, ResponseMessage, ResponseMessages } from 'src/api'

export type REQUEST_TOPIC = {
    type: 'REQUEST_TOPIC'
}

export type RECEIVE_TOPIC = {
    type: 'RECEIVE_TOPIC',
    info: ResponseInfo, 
    item0: ResponseMessage, 
    items: ResponseMessages,
    receivedAt: Date
}

export type RECEIVE_TOPIC_FAILED = {
    type: 'RECEIVE_TOPIC_FAILED',
    error: any,
    receivedAt: Date
}

export type TopicAction = REQUEST_TOPIC | RECEIVE_TOPIC | RECEIVE_TOPIC_FAILED;

export const requestTopic = () => ({
    type: 'REQUEST_TOPIC'
})

export const receiveTopic = (info: ResponseInfo, item0: ResponseMessage, items: ResponseMessages) => {

    return {
        type: 'RECEIVE_TOPIC',
        info,
        item0,
        items,
        receivedAt: Date.now()
    }
}


export const fetchTopic = (params: any, item0: ?ResponseMessage) => async (dispatch: Dispatch<*>) => {

    dispatch(requestTopic())

    let page = params.page || 1;
    let queries: Array<Promise<any>> = [];

    if (page === 'last20') {

        const info = await API.getTopicInfo(params);

        if (+info.answers_count > 21) {

            if (!item0)
                queries.push(API.getTopicMessages({
                    id: params.id,
                    from: 0,
                    to: 1
                }));            

            let first = +info.answers_count - 20;
            queries.push(API.getTopicMessages({
                id: params.id,
                from: first,
                to: 1010
            }));            

        } else {
            queries.push(API.getTopicMessages({
                id: params.id,
                from: 0,
                to: 1010
            }));               
        }

    } else {

        page = +page;
        let first = 0;

        queries.push(API.getTopicInfo({
            id: params.id
        }));

        if (page > 1) {

            first = (page - 1) * 100 + 1;
            if (!item0)
            queries.push(API.getTopicMessages({
                id: params.id,
                from: 0,
                to: 1
            }));

        } else {
            if (item0)
                first = 1;
            else
                first = 0;
        }

        let last = page * 100 - 1;
        queries.push(API.getTopicMessages({
            id: params.id,
            from: first,
            to: last
        }));        
    }
    
    try {
        const jsonArr = await Promise.all(queries);

        // info, item0, items 
        // info , items
        let info: ResponseInfo = jsonArr[0];
        let _item0, _items;
        if (item0) {
            _item0 = item0;
            _items = jsonArr[1];
        } else {
            _item0 = jsonArr[1][0];
            if (jsonArr.length === 3)
                _items = jsonArr[2];
            else    
                _items = jsonArr[1].slice(1);
        }

        dispatch(receiveTopic(info, _item0, _items));
    } catch (error) {

        console.error('Failed to fetch topic:', error);

        dispatch({
            type: 'RECEIVE_TOPIC_FAILED',
            error,
            receivedAt: Date.now()
        });

    }
}

const shouldFetch = (state) => {
    const topic = state.topic;
    if (!topic) {
        return true
    }
    if (topic.isFetching) {
        return false
    }
    return true
}

export const fetchTopicIfNeeded = (params: any, item0: ?ResponseMessage) => (dispatch: Dispatch<*>, getState: any) => {
    if (shouldFetch(getState())) {
        return dispatch(fetchTopic(params, item0));
    }
}

export type FetchNewMessageseParams = {
    id: number | string,
    last: number    
}

export const fetchNewMessages = (params: FetchNewMessageseParams) => async (dispatch: Dispatch<*>) => {

    dispatch({
        type: 'REQUEST_NEW_MESSAGES'
    });

    try {
        const json = await API.getTopicMessages({
            id: params.id,
            from: params.last + 1,
            to: 1002
        });

        dispatch({
            type: 'RECEIVE_NEW_MESSAGES',
            items: json,
            receivedAt: Date.now()
        });

    } catch (error) {
        console.error('Failed to fetch new messages:', error);

        dispatch({
            type: 'RECEIVE_NEW_MESSAGES_FAILED',
            error,
            receivedAt: Date.now()
        });
    }

}

export const fetchNewMessagesIfNeeded = (params: FetchNewMessageseParams) => (dispatch: Dispatch<*>, getState: any) => {
    if (shouldFetch(getState())) {
        return dispatch(fetchNewMessages(params));
    }
}
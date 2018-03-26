import React, { Component } from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { fetchTopicIfNeeded } from '../../actions/topic'

import Header from './header'
import TopicHeader from './topic_header'
import Row from './row'
import Footer from './footer'
import NewMessage from './new_message';

class Topic extends Component {

    componentDidMount() {

        const { dispatch, location } = this.props;
        this.params = queryString.parse(location.search);
        this.params.hash = location.hash;
        
        this.page = +this.params.page || 1;
        this.params.page = this.page;

        dispatch(fetchTopicIfNeeded(this.params));
    }

    render() {
        const { login, info, items, bookmark } = this.props;
        
        let columns = [
            { name: 'Автор', width: '165px' },
            { name: 'Текст' }
        ];

        let newMessage;
        if (login.userid)
            newMessage = <NewMessage />

        return (
            <div  >
                <Header info={info} currentPage={this.page} dispatch={this.props.dispatch}/>
                <table id='table_messages' style={{width: "100%"}}>
                    <colgroup>
                        {columns.map((item, i) => (
                            <col key={i} style={{ width: item.width }} />
                        ))}
                    </colgroup>
                    <tbody>
                        <TopicHeader info={info}/>
                        {items.map((item, i) => (
                            <Row key={i} columns={columns} data={item} info={info}/>
                        ))}
                    </tbody>
                </table>
                <Footer info={info} currentPage={this.page} dispatch={this.props.dispatch} params={this.params} bookmark={bookmark}/>
                {newMessage}
            </div>
        )
    }
}
const mapStateToProps = state => {

    const {
        isFetching,
        lastUpdated,
        info,
        items
    } = state.topic || {
        isFetching: true,
        info: {},
        items: []
    }

    return {
        login: state.login,
        info,
        items,
        isFetching,
        lastUpdated,
        bookmark: state.bookmark
    }
}

export default connect(mapStateToProps)(Topic);
import React, { Component } from 'react'

class LoggedUser extends Component {

    render() {

        const { userId, userName } = this.props;
        return (
            <td id="user-td">
                Привет, <a id="me" rel="nofollow" href={`users.php?id=${userId}`}>{userName}</a>
                | <a href="users.php?action=edit">Личные настройки</a>
                | <a href="users.php?&amp;action=exit">Выход</a>
                <br />
                <span className="find-my-topics-messages">
                    <noindex>
                        <a rel="nofollow" href={`index.php?user_id=${userId}`}>Мои темы</a>
                    </noindex>
                </span> |
                <span className="find-my-topics-messages">
                    <noindex>
                        <a rel="nofollow" href={`mytopics.php?user_id=${userId}`}>Темы с моим участием</a>
                    </noindex>
                </span>
            </td>
        )
    }
}

export default LoggedUser;
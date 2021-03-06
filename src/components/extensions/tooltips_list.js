//@flow
import React, { Component } from 'react';
import { connect } from 'react-redux'

import Tooltip from './tooltip'
import { defaultTooltipsState } from  'src/reducers/tooltips'

import type { State } from 'src/reducers'
import type { TooltipItemState } from 'src/reducers/tooltips'
import type { DefaultProps } from 'src/index'

type StateProps = {
    items: Array<TooltipItemState>
}

type Props = StateProps & DefaultProps;

class TooltipsList extends Component<Props> {

    render() {

        const { items } = this.props;

        return (
            <div>
                {items.map((item, i) => (
                    <Tooltip key={item.hash} tooltip={item} />
                ))}
            </div>
        )
    }
}

const mapStateToProps = (state: State): StateProps => {

    const {
        items
    } = state.tooltips || defaultTooltipsState

    return {
        items,
    }
}

export default connect(mapStateToProps)(TooltipsList);
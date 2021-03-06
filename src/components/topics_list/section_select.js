//@flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchSectionsIfNeeded } from '../../actions/sections'

import type { ResponseSection, ResponseSections } from '../../api'

import type { DefaultProps } from '../../components'
import type { State } from '../../reducers'

type SectionSelectProps = {
    defaultValue: string,
    selected: string,
    className: string,
    id: string,
    name: string,
    style?: {},
    onChange: (e: any, section: ResponseSection | null) => void
}

type StateProps = {
    items: ResponseSections,
    tree: {}
}

type Props = SectionSelectProps & StateProps & DefaultProps;

class SectionSelect extends Component<Props> {

    onChange;

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchSectionsIfNeeded());
    }

    onChange(event) {

        const { items, onChange } = this.props;

        if (onChange) {
            const shortn = event.target.value;
            const arr = items.filter(val => val.shortn === shortn);
            if (arr.length > 0) 
                onChange(event, arr[0]);
            else    
                onChange(event, null);
        }    
    }

    render() {

        const { tree, defaultValue, selected, className, id, name, style } = this.props;
        
        let sectionsElem = [];
        for (let forum in tree) {

            let group =
                <optgroup key={forum} label={forum}>
                    {tree[forum].map((item, i) => (
                        <option key={item.id} value={item.shortn} >
                            {item.fulln}
                        </option>
                    ))}
                </optgroup>

            sectionsElem.push(group);
        }

        return (
            <select className={className} id={id} name={name} style={style} onChange={this.onChange} value={selected}>
                <option value="">{defaultValue}</option>
                {sectionsElem}
            </select>
        )
    }
}

const mapStateToProps = (state: State): StateProps => {

    const { items, tree } = state.sections;

    return {
        items,
        tree
    }
}

export default connect(mapStateToProps)(SectionSelect);
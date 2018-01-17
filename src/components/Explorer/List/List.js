import React, { Component } from "react";
import Arrow from "../../Icon/Arrow";
import CSSModules from "react-css-modules";
import styles from "./List.css";
import Item from "../Item";

const options = {
    allowMultiple: true,
    handleNotFoundStyleName: "ignore"
};

@CSSModules(styles, options)

class List extends Component {

    state = {
        maxTop: true,
        maxBottom: true
    }
    
    componentDidMount() {
        // if containing files, then initialize
        if(this.props.clevel === 0) {
            this.initialize();
        };
    }

    componentWillUnmount = () => {
        if(this.props.clevel === 0) {
            let list = this.list;
            list.removeEventListener("onscroll", this.scrollIndicator, this);
        };
    }

    initialize = () => {
        let list = this.list;
        if(list.scrollHeight > list.clientHeight) {
            this.setState({ maxBottom: false })
        }
        list.addEventListener("scroll", this.scrollIndicator, this);
        list.addEventListener("click", this.clickIndicator, this)
    }

    clickIndicator = ev => {
        let { scrollHeight, clientHeight } = ev.target;
        if(scrollHeight <= clientHeight) {
            this.setState( { maxBottom: true });
        };
    }

    scrollIndicator = ev => {
        let { maxTop, maxBottom } = this.state;
        let list = ev.target;
        let isMaxBottom = ( list.scrollTop + list.clientHeight ) > ( list.scrollHeight - 5 );
        let isMaxTop = list.scrollTop === 0;
        // hide arrow when hit bottom
        if(isMaxTop) {
            return this.setState({ maxTop: true })
        };
        // hide arrow when hit top
        if(isMaxBottom) {
            return this.setState({ maxBottom: true })
        };
        // show arrows when in middle
        if(maxTop || maxBottom) {
            this.setState( { maxTop: false, maxBottom: false })
        }
    }

    render () {
        const data = this.props.data;
        const numFile = Object.keys(data).length;
        const clevel = this.props.clevel + 1;
        const maxlevel = this.props.nestedlevel;

        return(
            // only render only to certain level deep
            data && clevel <= maxlevel ?
                <div styleName="list">
                    {clevel === 1 ? 
                        <Arrow visible={!this.state.maxTop} direction="up"/> 
                    : null}

                    {numFile ?
                        <ul styleName="list-ul" ref={node => this.list = node}>
                            {Object.keys(data).map(file =>
                                this.props.data[file].__info ?
                                    <Item 
                                    clevel={clevel}
                                    copy={this.props.copy}
                                    match={this.props.match}
                                    remove={this.props.remove}
                                    initialize={this.props.initialize}
                                    week={this.props.week}
                                    role={this.props.role}
                                    nestedlevel={this.props.nestedlevel}
                                    key={data[file].__info.rel} 
                                    item={data[file]}/>
                                : null
                            )}
                        </ul>
                    :
                        clevel > 1 ?
                            <div styleName="list-placeholder">Empty Directory</div>
                        :
                            null
                    }

                    {clevel == 1 ? 
                        <Arrow visible={!this.state.maxBottom} direction="down"/> 
                    : null}
                </div>
                
            : null
        )
    }
};

export default List;
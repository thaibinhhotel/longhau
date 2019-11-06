import PropTypes from 'prop-types'
import _ from 'lodash'
// import faker from 'faker'
import React, {Component} from 'react'
import {Search, Grid, Header, Segment, Label} from 'semantic-ui-react'

// const faker = this.props.listRoomId;

// const source = _.times(5, () => ({
//     // title: faker.company.companyName(),
//     // description: faker.company.catchPhrase(),
//     // image: faker.internet.avatar(),
//     // price: faker.finance.amount(0, 100, 2, '$'),
//     title: 'Bangth',
//     description: "test",
//     image: "test img",
// }))

const title = [{"title": "bangth"}, {"title": "bangth2"}, {"title": "bangth2"}];
const resultRenderer = (<Label content={title}/>);

export class SearchingTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            results: [],
            value: '',
            source: this.props.listRoomId,
        };
    }

    handleResultSelect = (e, {result}) => this.setState({value: result.key})

    handleSearchChange = (e, {value}) => {
        this.setState({isLoading: true, value})

        setTimeout(() => {
            if (this.state.value.length < 1) return this.setState({
                isLoading: false,
                results: [],
                value: '',
                source: this.props.listRoomId
            })

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = (result) => re.test(result.key)

            this.setState({
                isLoading: false,
                results: _.filter(this.state.source, isMatch),
            })
        }, 300)
    }

    componentDidMount() {
        console.log(this.props.listRoomId);
    }

    render() {
        const {isLoading, value, results} = this.state

        return (
            <div style={{width: '100%'}}>
                <Search
                    fluid
                    icon='search'
                    aligned='right'
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, {
                        leading: true,
                    })}
                    results={results}
                    value={value}
                />

                {/*<Grid.Column width={10}>*/}
                {/*    <Segment>*/}
                {/*        <Header>State</Header>*/}
                {/*        <pre style={{overflowX: 'auto'}}>*/}
                {/*          {JSON.stringify(this.state, null, 2)}*/}
                {/*        </pre>*/}
                {/*        <Header>Options</Header>*/}
                {/*        <pre style={{overflowX: 'auto'}}>*/}
                {/*          {JSON.stringify(this.state.source, null, 2)}*/}
                {/*        </pre>*/}
                {/*    </Segment>*/}
                {/*</Grid.Column>*/}
            </div>
        )
    }
}

SearchingTab.propTypes = {
    listRoomId: PropTypes.array,
}


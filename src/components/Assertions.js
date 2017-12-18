import React, { Component } from 'react'
import { Button, Icon, Input, Table } from 'semantic-ui-react'

class Assertions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      assertions: props.assertions || []
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ assertions: nextProps.assertions || [] })
  }


  addAssertion() {
    const assertions = this.state.assertions
    assertions.push({ id: assertions.length + 1, on: 'headers', type: 'is' })

    this.setState({ assertions })
  }

  updateAssertion(assertion, parts) {
    const assertions = this.state.assertions
    const newAsserts = assertions.map(a => {
      if (a.id === assertion.id) {
        return {...assertion, ...parts}
      }
      return a
    })

    this.props.onChange(newAsserts)

    this.setState({assertions: newAsserts})
  }

  removeAssertion(assertion) {
    const assertions = this.state.assertions
    const newAsserts = assertions.map(a => {
      if (a.id === assertion.id) {
        return undefined
      }
      return a
    }).filter(a => a !== undefined)

    this.props.onChange(newAsserts)

    this.setState({assertions: newAsserts})
  }

  render() {
    const { assertions } = this.state

    const Assert = (props) => <Table.Row>
      <Table.Cell>
        <select value={props.assert.on} onChange={(e) => this.updateAssertion(props.assert, {on: e.target.value})}>
          <option value='headers'>headers</option>
          <option value='status'>status code</option>
          <option value='body'>body</option>
        </select>
      </Table.Cell>
      <Table.Cell>
        <select value={props.assert.type} onChange={(e) => this.updateAssertion(props.assert, {type: e.target.value})}>
          <option value='is'>is</option>
          <option value='c'>contains</option>
          <option value='nc'>not contains</option>
        </select>
      </Table.Cell>
      <Table.Cell>
        <Input fluid value={props.assert.value} onBlur={(e) => this.updateAssertion(props.assert, {value: e.target.value})} />
      </Table.Cell>
      <Table.Cell>
        <Button icon='trash' onClick={() => this.removeAssertion(props.assert)}/>
      </Table.Cell>
    </Table.Row>

    return (
      <div>
        <Button onClick={() => this.addAssertion()}><Icon name='add' /> Add an assertion</Button>
        <Table celled padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>On</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { assertions.map((a,i) => <Assert key={i} assert={a} />) }
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default Assertions
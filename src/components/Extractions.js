import React, { Component } from 'react'
import { Button, Icon, Input, Table } from 'semantic-ui-react'

class Extractions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      extractions: props.extractions || []
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ extractions: nextProps.extractions || [] })
  }


  addExtraction() {
    const extractions = this.state.extractions
    extractions.push({ id: extractions.length + 1, on: 'headers' })

    this.setState({ extractions })
  }

  updateExtraction(extraction, parts) {
    const extractions = this.state.extractions
    const newExtracts = extractions.map(a => {
      if (a.id === extraction.id) {
        return {...extraction, ...parts}
      }
      return a
    })

    this.props.onChange(newExtracts)

    this.setState({extractions: newExtracts})
  }

  removeExtraction(extraction) {
    const extractions = this.state.extractions
    const newExtracts = extractions.map(a => {
      if (a.id === extraction.id) {
        return undefined
      }
      return a
    }).filter(a => a !== undefined)

    this.props.onChange(newExtracts)

    this.setState({extractions: newExtracts})
  }

  render() {
    const { extractions } = this.state

    const Extract = (props) => <Table.Row>
      <Table.Cell>
        <select value={props.extract.on} onChange={(e) => this.updateExtraction(props.extract, {on: e.target.value})}>
          <option value='headers'>headers</option>
          <option value='status'>status code</option>
          <option value='body'>body</option>
        </select>
      </Table.Cell>
      <Table.Cell>
        {props.extract.on !== 'status' && <Input fluid value={props.extract.value} onBlur={(e) => this.updateExtraction(props.extract, {value: e.target.value})} />}
      </Table.Cell>
      <Table.Cell>
        <Input icon='dollar' iconPosition='left' fluid value={props.extract.as} onBlur={(e) => this.updateExtraction(props.extract, {as: e.target.value})} />
      </Table.Cell>
      <Table.Cell>
        <Button icon='trash' onClick={() => this.removeExtraction(props.extract)}/>
      </Table.Cell>
    </Table.Row>

    return (
      <div>
        <Button onClick={() => this.addExtraction()}><Icon name='add' /> Add an extraction</Button>
        <Table celled padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>On</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
              <Table.HeaderCell>As</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { extractions.map((e,i) => <Extract key={i} extract={e} />) }
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default Extractions
import React, { Component } from 'react'
import { Label, Message, Modal, Table } from 'semantic-ui-react'
import { DragSource } from 'react-dnd'
import Parameter from './Parameter'
import Assertions from './Assertions'
import Extractions from './Extractions'

export const DRAG_TYPES = { PATH: 'path' };

const boxSource = {
  beginDrag(props) {
    return {
      ...props,
    }
  },

  endDrag(props, monitor) {
    const dropResult = monitor.getDropResult()

    if (dropResult && props.onDropped) {
      props.onDropped(props, dropResult)
    }
  },
}

@DragSource(DRAG_TYPES.PATH, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
class Path extends Component {

  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false
    }
  }

  handleClick() {
    if (this.props.selectParams) {
      this.setState({ modalOpen: true })
    }
  }

  handleClose() {
    this.setState({ modalOpen: false })
  }

  onParameterTestValueChange(paramSpec, value) {
    this.props.onTestValueChange(paramSpec.name, value)
  }

  render() {
    const { color, method, path, summary, disabled, spec, isDragging, connectDragSource, assertions, extractions, onAssertionsChange, onExtractionsChange, testValues } = this.props
    const opacity = isDragging ? 0.4 : 1
    const marginBottom = '10px'

    return connectDragSource(
      <div style={{ marginBottom }}>
        <Message color={color} style={{ opacity }} onClick={() => this.handleClick()}>
          <Label color={color} horizontal>{method}</Label>
          <strong>
            {disabled && <strike>{path}</strike>}
            {!disabled && path}
          </strong>&nbsp;&nbsp;{summary}
        </Message>
        <Modal open={this.state.modalOpen} onClose={() => this.handleClose()}>
          <Modal.Header>Parameters, Assertions And Extractions</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <h3>Parameters</h3>
              <Table celled padded>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>In</Table.HeaderCell>
                    <Table.HeaderCell>Value</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {spec && spec.parameters && spec.parameters.map((subSpec, i) =>
                    <Parameter key={i} spec={subSpec} value={testValues[subSpec.name]} onChange={(value) => this.onParameterTestValueChange(subSpec, value)} />
                  )}
                  {spec && spec.requestBody && spec.requestBody.content && spec.requestBody.content['application/json'] && (
                    <Parameter body={true} spec={spec.requestBody.content['application/json']} value={testValues[spec.requestBody.content['application/json'].name]} onChange={(value) => this.onParameterTestValueChange(spec.requestBody.content['application/json'], value)} />
                  )}
                </Table.Body>
              </Table>
              <h3>Assertions</h3>

              <Assertions assertions={assertions} onChange={(assertions) => onAssertionsChange(assertions)} />

              <h3>Extractions</h3>

              <Extractions extractions={extractions} onChange={(extractions) => onExtractionsChange(extractions)} />

            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>)
  }
}

export default Path
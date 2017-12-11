import React, { Component } from 'react'
import { Input, Label, Message, Modal, Table } from 'semantic-ui-react'
import { DragSource } from 'react-dnd'
import Parameter from './Parameter'

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

  render() {
    const { color, method, path, summary, disabled, spec, isDragging, connectDragSource } = this.props
    const opacity = isDragging ? 0.4 : 1
    const marginBottom = '10px'

    return connectDragSource(<div style={{ marginBottom }}><Message color={color} style={{ opacity }} onClick={() => this.handleClick()}>
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
                {spec && spec.parameters && spec.parameters.map((subSpec, i) => <Parameter key={i} spec={subSpec} />)}
              </Table.Body>
            </Table>
            <h3>Assertions</h3>
            <Table celled padded>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>On</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Value</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <select>
                      <option>headers</option>
                      <option>status code</option>
                      <option>body</option>
                    </select>
                  </Table.Cell>
                  <Table.Cell>
                    <select>
                      <option>is</option>
                      <option>contains</option>
                      <option>not contains</option>
                    </select>
                  </Table.Cell>
                  <Table.Cell>
                    <Input fluid />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <h3>Extractions</h3>

            <select>
              <option>headers</option>
              <option>status code</option>
              <option>body</option>
            </select>.<Input /> as $<Input />

          </Modal.Description>
        </Modal.Content>
      </Modal>
    </div>)
  }
}

export default Path
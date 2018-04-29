import * as React from 'react';
import { ConnectDragSource, DragSource } from 'react-dnd'
import { Label, Message, Modal } from 'semantic-ui-react'
import { DRAG_TYPES } from './Path';

interface ISecurityDefinitionState {
  modalOpen: boolean;
}

interface ISecurityDefinitionProps {
  connectDragSource?: ConnectDragSource;
  isDragging?: boolean;
  selectParams?: boolean;
  name: string;
  spec: any;
  onDropped?(props: any, dropResult: any): void;
}

const boxSource = {
  beginDrag(props: ISecurityDefinitionProps) {
    return {
      ...props,
    }
  },

  endDrag(props: ISecurityDefinitionProps, monitor: any) {
    const dropResult = monitor.getDropResult()

    if (dropResult && props.onDropped) {
      props.onDropped(props, dropResult)
    }
  },
}

class SecurityDefinition extends React.Component<ISecurityDefinitionProps, ISecurityDefinitionState> {
  constructor(props: ISecurityDefinitionProps) {
    super(props)

    this.state = {
      modalOpen: false
    }
  }

  public handleClick() {
    if (this.props.selectParams) {
      this.setState({ modalOpen: true })
    }
  }

  public handleClose() {
    this.setState({ modalOpen: false })
  }

  public render() {
    const { name, spec, isDragging, connectDragSource } = this.props
    const opacity = isDragging ? 0.4 : 1
    const marginBottom = '10px'
    const color = 'brown'

    if (!connectDragSource) { return null; }

    return connectDragSource(
      <div style={{ marginBottom }}>
        <Message color={color} style={{ opacity }} onClick={() => this.handleClick()}>
          <Label color={color} horizontal>{spec.type}</Label>
          <strong>
            {name}
          </strong>&nbsp;&nbsp;{spec.description}
        </Message>
        <Modal open={this.state.modalOpen} onClose={() => this.handleClose()}>
          <Modal.Header>Security parameters</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              TODO
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

export default DragSource(DRAG_TYPES.PATH, boxSource, (connect: any, monitor: any) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(SecurityDefinition);

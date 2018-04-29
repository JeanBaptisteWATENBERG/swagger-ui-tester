import * as React from 'react';
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor, DragSourceSpec } from 'react-dnd'
import { Label, Message, Modal } from 'semantic-ui-react'
import { DRAG_TYPES } from './Path';

interface IHelperState {
  modalOpen: boolean;  
}

interface IHelperProps {
  selectParams?: any;
  name: string;
  connectDragSource?: ConnectDragSource;
  isDragging?: boolean;
  onDropped?(props: any, dropResult: any): void;
}

const boxSource: DragSourceSpec<IHelperProps> = {
  beginDrag(props: IHelperProps) {
    return {
      ...props,
    }
  },

  endDrag(props: IHelperProps, monitor: DragSourceMonitor) {
    const dropResult = monitor.getDropResult()

    if (dropResult && props.onDropped) {
      props.onDropped(props, dropResult)
    }
  },
}

class Helper extends React.Component<IHelperProps, IHelperState> {
  constructor(props: IHelperProps) {
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
    const { name, isDragging, connectDragSource } = this.props
    const opacity = isDragging ? 0.4 : 1
    const marginBottom = '10px'
    const color = 'olive'

    if (!connectDragSource) { return null; }

    return connectDragSource(
      <div style={{ marginBottom }}>
        <Message color={color} style={{ opacity }} onClick={() => this.handleClick()}>
          <Label color={color} horizontal>HELPER</Label>
          <strong>
            {name}
          </strong>
        </Message>
        <Modal open={this.state.modalOpen} onClose={() => this.handleClose()}>
          <Modal.Header>Helper parameters</Modal.Header>
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

export default DragSource(DRAG_TYPES.PATH, boxSource, (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(Helper);

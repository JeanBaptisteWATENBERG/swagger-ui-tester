import * as React from 'react';
import { ConnectDragSource, DragSource } from 'react-dnd'
import { Label, Message, Modal, SemanticCOLORS, Table } from 'semantic-ui-react'
import Assertions from './Assertions'
import Extractions from './Extractions'
import Parameter from './Parameter'

interface IPathState {
  modalOpen: boolean;
}

interface IPathProps {
  selectParams?: any;
  connectDragSource?: ConnectDragSource;
  isDragging?: boolean;
  color?: SemanticCOLORS; 
  method: string; 
  path: string;
  summary?: string;
  disabled?: boolean;
  spec: any;
  assertions?: any[];
  extractions?: any[];
  testValues?: any;
  onAssertionsChange?(newAsserts: any[]): void;
  onDropped?(props: any, dropResult: any): void;
  onExtractionsChange?(newExtracts: any[]): void;
  onTestValueChange?(fieldName: string, newValue: string): void;
}

export const DRAG_TYPES = { PATH: 'path' };

const boxSource = {
  beginDrag(props: IPathProps) {
    return {
      ...props,
    }
  },

  endDrag(props: IPathProps, monitor: any) {
    const dropResult = monitor.getDropResult()

    if (dropResult && props.onDropped) {
      props.onDropped(props, dropResult)
    }
  },
}

class Path extends React.Component<IPathProps, IPathState> {

  constructor(props: IPathProps) {
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

  public onParameterTestValueChange(paramSpec: any, value: string) {
    if (this.props.onTestValueChange) {
      this.props.onTestValueChange(paramSpec.name, value)
    }
  }

  public render() {
    const { color, method, path, summary, disabled, spec, isDragging, connectDragSource, assertions, extractions, onAssertionsChange, onExtractionsChange, testValues } = this.props
    const opacity = isDragging ? 0.4 : 1
    const marginBottom = '10px'

    if (!connectDragSource) { return null; }

    return connectDragSource(
      <div style={{ marginBottom }}>
        <Message color={color} style={{ opacity }} onClick={() => this.handleClick()}>
          <Label color={color} horizontal>{method}</Label>
          <strong>
            {disabled && <span style={{textDecoration: 'line-through'}}>{path}</span>}
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
                  {spec && spec.parameters && spec.parameters.map((subSpec: any, i: number) =>
                    <Parameter key={i} spec={subSpec} value={testValues[subSpec.name]} onChange={(value) => this.onParameterTestValueChange(subSpec, value)} />
                  )}
                  {spec && spec.requestBody && spec.requestBody.content && spec.requestBody.content['application/json'] && (
                    <Parameter body={true} spec={spec.requestBody.content['application/json']} value={testValues[spec.requestBody.content['application/json'].name]} onChange={(value) => this.onParameterTestValueChange(spec.requestBody.content['application/json'], value)} />
                  )}
                </Table.Body>
              </Table>
              <h3>Assertions</h3>

              {onAssertionsChange && <Assertions assertions={assertions} onChange={(updatedAssertions: any[]) => onAssertionsChange(updatedAssertions)} />}

              <h3>Extractions</h3>

              {onExtractionsChange && <Extractions extractions={extractions} onChange={(updatedExtractions: any[]) => onExtractionsChange(updatedExtractions)} />}

            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>)
  }
}

export default DragSource(DRAG_TYPES.PATH, boxSource, (connect: any, monitor: any) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(Path);

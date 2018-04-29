import * as React from 'react';
import { DropTarget } from 'react-dnd'
import { Message } from 'semantic-ui-react'
import Helper from './Helper';
import Path from './Path';
import { DRAG_TYPES } from './Path';
import SecurityDefinition from './SecurityDefinition';

// tslint:disable-next-line:no-empty-interface
interface IScenarioState {
}

interface IScenarioProps {
  canDrop?: boolean;
  isOver?: boolean;
  connectDropTarget?: any;
  scenario: any;// TODO replace by spec ! See (use?) https://github.com/JeanBaptisteWATENBERG/rest-test-scenari-executor/tree/master/src/models
  onAssertionsChange(path: any, assertions: any[]): void;
  onExtractionsChange(path: any, extractions: any[]): void;
  onTestValueChange(path: any, paramName: string, value: string): void;
}


const dropArea = {
  borderColor: '#666',
  borderRadius: 5,
  borderStyle: 'dashed',
  borderWidth: 2,
  height: (window.innerHeight - 165) + 'px',
  maxHeight: (window.innerHeight - 165) + 'px',
  // overflowY: 'auto',
}

const boxTarget = {
  drop(props: IScenarioProps) {
    return { ...props.scenario }
  },
}

class Scenario extends React.Component<IScenarioProps, IScenarioState> {
  public render() {
    const { canDrop, isOver, connectDropTarget, scenario, onAssertionsChange, onExtractionsChange, onTestValueChange } = this.props
    const isActive = canDrop && isOver
    const borderColor = isActive ? 'green' : '#666'
    const borderStyle = isActive ? 'solid' : 'dashed'

    return connectDropTarget(
      <div style={{ ...dropArea, borderStyle, borderColor }}>
        {scenario && scenario.paths && scenario.paths.map((path: any, i: number) => {
          if (path.type === 'PATH') {
            return <Path
              key={i}
              color={path.color}
              disabled={path.disabled}
              path={path.path}
              method={path.method}
              summary={path.summary}
              spec={path.spec}
              testValues={path.testValues || {}}
              assertions={path.assertions}
              extractions={path.extractions}
              onAssertionsChange={(assertions: any[]) => onAssertionsChange(path, assertions)}
              onExtractionsChange={(extractions: any[]) => onExtractionsChange(path, extractions)}
              onTestValueChange={(paramName: string, value: string) => onTestValueChange(path, paramName, value)}
              selectParams />
          } else if (path.type === 'SECURITY_DEFINITION') {
            return <SecurityDefinition key={i} spec={path.spec} name={path.name} selectParams/>
          } else if (path.type === 'HELPER') {
            return <Helper key={i} name={path.name} selectParams/>
          }
          return <Message key={i}>Operation not supported</Message>
        })}
      </div>
    )
  }
}

export default DropTarget(DRAG_TYPES.PATH, boxTarget, (connect: any, monitor: any) => ({
  canDrop: monitor.canDrop(),
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(Scenario);

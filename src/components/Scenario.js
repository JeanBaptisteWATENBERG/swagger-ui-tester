import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'
import { Message } from 'semantic-ui-react'
import Path from './Path';
import SecurityDefinition from './SecurityDefinition';
import Helper from './Helper';
import { DRAG_TYPES } from './Path';

const dropArea = {
  borderWidth: 2,
  borderColor: '#666',
  borderStyle: 'dashed',
  height: (window.innerHeight - 165) + 'px',
  maxHeight: (window.innerHeight - 165) + 'px',
  overflowY: 'auto',
  borderRadius: 5
}

const boxTarget = {
  drop(props) {
    return { ...props.scenario }
  },
}

@DropTarget(DRAG_TYPES.PATH, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
class Scenario extends Component {
  render() {
    const { canDrop, isOver, connectDropTarget, scenario, onAssertionsChange, onExtractionsChange, onTestValueChange } = this.props
    const isActive = canDrop && isOver
    const borderColor = isActive ? 'green' : '#666'
    const borderStyle = isActive ? 'solid' : 'dashed'

    return connectDropTarget(
      <div style={{ ...dropArea, borderStyle, borderColor }}>
        {scenario && scenario.paths && scenario.paths.map((path, i) => {
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
              onAssertionsChange={(assertions) => onAssertionsChange(path, assertions)}
              onExtractionsChange={(extractions) => onExtractionsChange(path, extractions)}
              onTestValueChange={(paramName, value) => onTestValueChange(path, paramName, value)}
              selectParams />
          } else if (path.type === 'SECURITY_DEFINITION') {
            return <SecurityDefinition key={i} spec={path.spec} name={path.name} selectParams/>
          } else if (path.type === 'HELPER') {
            return <Helper key={i} name={path.name} selectParams/>
          }
          return <Message>Operation not supported</Message>
        })}
      </div>
    )
  }
}

export default Scenario
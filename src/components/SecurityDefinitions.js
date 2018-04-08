import React, { Component } from 'react'
import SecurityDefinition from './SecurityDefinition.js'

class SecurityDefinitions extends Component {
  render () {
    const { spec, onDropped } = this.props

    return (
      <div>
        {spec && spec.components && spec.components.securitySchemes && 
          Object.keys(spec.components.securitySchemes).map((securityDefinition, i) => 
          <SecurityDefinition
            key={i}
            name={securityDefinition}
            spec={spec.components.securitySchemes[securityDefinition]}
            onDropped={(props, dropResult) => onDropped(props, dropResult)}
          />)}    
      </div>
    )
  }
}

export default SecurityDefinitions
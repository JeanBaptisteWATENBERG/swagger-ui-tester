import React, { Component } from 'react'
import SecurityDefinition from './SecurityDefinition.js'

class SecurityDefinitions extends Component {
  render () {
    const { spec, onDropped } = this.props

    return (
      <div>
        {spec && Object.keys(spec.securityDefinitions).map((securityDefinition, i) => 
          <SecurityDefinition
            key={i}
            name={securityDefinition}
            spec={spec.securityDefinitions[securityDefinition]}
            onDropped={(props, dropResult) => onDropped(props, dropResult)}
          />)}    
      </div>
    )
  }
}

export default SecurityDefinitions
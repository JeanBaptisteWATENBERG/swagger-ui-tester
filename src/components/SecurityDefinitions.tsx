import * as React from 'react';
import SecurityDefinition from './SecurityDefinition'

interface ISecurityDefinitionsProps {
  spec: any;
  onDropped(props: any, dropResult: any): void;
}

class SecurityDefinitions extends React.Component<ISecurityDefinitionsProps> {
  public render () {
    const { spec, onDropped } = this.props

    return (
      <div>
        {spec && spec.components && spec.components.securitySchemes && 
          Object.keys(spec.components.securitySchemes).map((securityDefinition, i) => 
          <SecurityDefinition
            key={i}
            name={securityDefinition}
            spec={spec.components.securitySchemes[securityDefinition]}
            onDropped={(props: any, dropResult: any) => onDropped(props, dropResult)}
          />)}    
      </div>
    )
  }
}

export default SecurityDefinitions
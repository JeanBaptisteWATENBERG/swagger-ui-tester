import * as React from 'react';
import Helper from './Helper'

interface IHelpersProps {
  onDropped(props: any, dropResult: any): void;
}

class Helpers extends React.Component<IHelpersProps> {
  public render () {
    const { onDropped } = this.props
    const helpers = [
      { name: 'Wait for XX ms' },
      { name: 'Wait for scenario #XX' },
    ]

    return (
      <div>
        {helpers.map((helper, i) => <Helper
          key={i}
          name={helper.name}
          onDropped={(props: any, dropResult: any) => onDropped(props, dropResult)}/>)}
      </div>
    )
  }
}

export default Helpers
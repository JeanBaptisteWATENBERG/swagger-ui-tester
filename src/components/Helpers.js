import React, { Component } from 'react'
import Helper from './Helper.js'

class Helpers extends Component {
  render () {
    const { onDropped } = this.props
    const helpers = [
      { name: 'Wait for XX ms' },
      { name: 'Wait for scenario #XX' },
    ]

    return (
      <div>
        {helpers.map((helper, i) => <Helper key={i} name={helper.name} onDropped={(props, dropResult) => onDropped(props, dropResult)}/>)}
      </div>
    )
  }
}

export default Helpers
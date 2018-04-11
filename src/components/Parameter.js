import React, { Component } from 'react'
import { Input, Table, TextArea } from 'semantic-ui-react'

class Parameter extends Component {

  constructor(props) {
    super(props)

    this.state = {
      val: undefined
    }
  }

  componentDidMount () {
    const { spec, onChange, value, body } = this.props

    if (!value) {
      if (body) {
        onChange(this.bodyAsJson(spec.schema.properties))
      } else {
        onChange(spec.example || this.getExampleValueForType(spec.type, spec.format))
      }
    }
  }
  

  bodyAsJson(properties) {
    return '{\n' + Object.keys(properties).map(key => {
      let computedExample = this.getExampleValueForTypeWrapped(properties[key].type, properties[key].format)

      if (properties[key].type === "object") {
        let tempBody = this.bodyAsJson(properties[key].properties)
        computedExample = tempBody.split('\n').map(line => '\t' + line).join('\n')
      } else if (properties[key].type === "array") {
        if (properties[key].items.type === "object") {
          let tempBody = this.bodyAsJson(properties[key].items.properties)
          computedExample = "[" + tempBody.split('\n').map(line => '\t' + line).join('\n') + "]"
        } else {
          computedExample = "[" + this.getExampleValueForTypeWrapped(properties[key].items.type, properties[key].items.format) + "]"
        }
      }

      return `\t"${key}": ${
        (properties[key].example && properties[key].type === 'string' ? '"' + properties[key].example + '"' : properties[key].example) ||
        computedExample}`
    }).join(',\n') +
      '\n}'
  }

  getExampleValueForTypeWrapped(type, format) {
    if (type === 'string') {
      return '"' + this.getExampleValueForType(type, format) + '"'
    }
    return this.getExampleValueForType(type, format)
  }

  getExampleValueForType(type, format) {
    switch (type) {
      case 'integer':
        return '0'
      case 'string':
        switch (format) {
          case 'byte':
            return 'aGVsbG8gd29ybGQK'
          case 'binary':
            return '011101001001'
          case 'date':
            return '31-12-1990'
          case 'date-time':
            return '31-12-1990T15:05:03.103Z+01:00'
          default:
            return 'string'
        }
      case 'boolean':
        return 'false'
      case 'number':
        return '5.6'
      default:
        return 'string'
    }
  }

  getTypeAsHtml(type, format) {
    switch (type) {
      case 'integer':
        return 'number'
      case 'string':
        switch (format) {
          case 'byte':
            return 'text'
          case 'binary':
            return 'text'
          case 'date':
            return 'date'
          case 'date-time':
            return 'datetime'
          default:
            return 'text'
        }
      case 'boolean':
        return 'checkbox'
      case 'number':
        return 'text'
      case 'file':
        return 'file'
      default:
        return 'text'
    }
  }

  render() {
    const { spec, onChange, value, body } = this.props

    return (
      <Table.Row>
        <Table.Cell>{spec.name || (body && 'body')}</Table.Cell>
        <Table.Cell>{spec.in  || (body && 'body')}</Table.Cell>
        <Table.Cell>
          {body && <TextArea onChange={(e) => this.setState({val: e.target.value})} onBlur={(e) => onChange(e.target.value)} value={this.state.val || value || this.bodyAsJson(spec.schema.properties)} autoHeight style={{ width: '100%' }} />}
          {!body && <Input onChange={(e) => this.setState({val: e.target.value})} onBlur={(e) => onChange(e.target.value)} type={this.getTypeAsHtml(spec.type, spec.format)} value={this.state.val || value || spec.example || this.getExampleValueForType(spec.type, spec.format)} fluid />}
        </Table.Cell>
      </Table.Row>
    )
  }
}

export default Parameter
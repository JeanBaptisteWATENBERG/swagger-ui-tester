import React, { Component } from 'react'
import { Input, Table, TextArea } from 'semantic-ui-react'

class Parameter extends Component {

  bodyAsJson(properties) {
    return '{\n' + Object.keys(properties).map(key =>
      `\t"${key}": ${
      (properties[key].example && properties[key].type === 'string' ? '"' + properties[key].example + '"' : properties[key].example) ||
      this.getExampleValueForTypeWrapped(properties[key].type, properties[key].format)}`).join(',\n') +
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
    const { spec } = this.props

    console.log(spec)
    return (
      <Table.Row>
        <Table.Cell>{spec.name}</Table.Cell>
        <Table.Cell>{spec.in}</Table.Cell>
        <Table.Cell>
          {spec.in === 'body' && <TextArea value={this.bodyAsJson(spec.schema.properties)} autoHeight style={{ width: '100%' }} />}
          {spec.in !== 'body' && <Input type={this.getTypeAsHtml(spec.type, spec.format)} value={spec.example || this.getExampleValueForType(spec.type, spec.format)} fluid />}
        </Table.Cell>
      </Table.Row>
    )
  }
}

export default Parameter
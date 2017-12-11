import React, { Component } from 'react';
import { Button, Container, Divider, Grid, Icon, Input, Menu } from 'semantic-ui-react'
import Paths from './components/Paths'
import Scenario from './components/Scenario'

import 'semantic-ui-css/semantic.min.css';

const leftPane = {
  maxHeight: window.innerHeight + 'px',
  overflowY: 'auto'
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      specUrl: 'http://petstore.swagger.io/v2/swagger.json',
      loading: true,
      spec: {},
      scenaris: [],
      currentScenario: undefined
    }
  }

  componentDidMount () {
    this.loadSpec(this.state.specUrl)
  }
  

  loadSpec(specUrl) {
    this.setState({ loading: true })
    fetch(specUrl).then(response => response.json()).then((spec) => {
      const preparedSpec = this.prepareSpec(spec, spec)
      this.setState({ loading: false, specUrl, spec: preparedSpec })
    }).catch((e) => this.setState({ loading: false, specUrl }))
  }

  prepareSpec(fullSpec, spec) {
    if(Array.isArray(spec)) {
      return spec.map(key => this.prepareSpec(fullSpec, key))
    }
    if (typeof spec === 'object') {
      Object.keys(spec).forEach(key => {
        if (key === '$ref') {
          const path = spec[key].replace("#/", "").split("/")
          spec = fullSpec[path[0]][path[1]]
        } else {
          spec[key] = this.prepareSpec(fullSpec, spec[key])
        }
      })
    }
    return spec
  }

  addScenario() {
    const scenaris = this.state.scenaris;
    const id = scenaris.length + 1;
    const newScenario = {
      specUrl: this.state.specUrl,
      name: 'Scenario #' + id,
      id
    };

    scenaris.push(newScenario);
    this.setState({ scenaris });
    this.setCurrentScenarioTo(newScenario);
  }

  removeScenario(scenario) {
    const scenaris = this.state.scenaris
    const newSceanris = scenaris.map(scenar => {
      if (scenar.id === scenario.id) {
        return undefined
      }
      return scenar
    }).filter(scenar => scenar !== undefined)
    this.setState({ scenaris: newSceanris })
  }

  setCurrentScenarioTo(scenario) {
    this.setState({ currentScenario: scenario });
  }

  onPathDropped(pathProps, scenario) {
    const { color, method, path, summary, disabled, spec } = pathProps;

    const scenaris = this.state.scenaris
    let currentScenario;
    const newSceanris = scenaris.map(scenar => {
      if (scenar.id === scenario.id) {
        if (!scenar.paths) scenar.paths = []
        scenar.paths.push({color, method, path, summary, disabled, spec})
        currentScenario = scenar
        return scenar
      }
      return scenar
    })

    this.setState({scenaris: newSceanris, currentScenario})
  }

  render() {
    const { scenaris, currentScenario } = this.state

    return (
        <Container>
          <Grid divided>
            <Grid.Row style={{ paddingTop: 0, paddingBottom: 0 }}>
              <Grid.Column width={5}>
                <Container style={leftPane}>
                  <Divider hidden />
                  <Input
                    fluid
                    loading={this.state.loading}
                    value={this.state.specUrl}
                    onChange={(e) => { this.loadSpec(e.target.value) }}
                    placeholder='Insert swagger spec url here...' />
                  <Divider hidden />
                  {Object.keys(this.state.spec).length > 0 &&
                    <Paths spec={this.state.spec} onDropped={(props, dropResult) => this.onPathDropped(props, dropResult)}></Paths>
                  }
                  <Divider hidden />
                </Container>
              </Grid.Column>
              <Grid.Column width={11}>
                <Container>
                  <Divider hidden />
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={11}>
                        <h2>Tests scenarios</h2>
                      </Grid.Column>
                      <Grid.Column width={5}>
                        <Button.Group floated='right'>
                          <Button basic color='green' icon='play'></Button>
                          <Button basic color='green' icon='forward'></Button>
                        </Button.Group>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <Menu attached='top' icon>
                    {scenaris.length > 0 && scenaris.map(scenario =>
                      <Menu.Item
                        key={scenario.id}
                        name={scenario.name}
                        active={currentScenario.id === scenario.id}
                        onClick={() => this.setCurrentScenarioTo(scenario)}>
                        {scenario.name} <Icon name='trash' onClick={() => this.removeScenario(scenario)} />
                      </Menu.Item>)}
                    <Menu.Item name='Add a scenario' onClick={() => this.addScenario()}>
                      <Icon name='add' />
                    </Menu.Item>
                    <Menu.Menu position='right'>
                      <Menu.Item>
                        <Input transparent icon={{ name: 'search', link: true }} placeholder='Search a scenario...' />
                      </Menu.Item>
                    </Menu.Menu>
                  </Menu>
                  <Divider hidden />
                  {currentScenario && <Scenario scenario={currentScenario} />}
                </Container>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
    );
  }
}

export default App;

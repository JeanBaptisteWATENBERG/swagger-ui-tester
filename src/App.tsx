import * as React from 'react';
import { Button, Container, Divider, Grid, Icon, Input, Menu } from 'semantic-ui-react'
import converter from 'swagger2openapi'
import Helpers from './components/Helpers'
import Paths from './components/Paths'
import Scenario from './components/Scenario'
import SecurityDefinitions from './components/SecurityDefinitions'

const leftPane = {
  maxHeight: window.innerHeight + 'px',
  overflowY: 'auto'
}

interface IAppState {
  specUrl: string;
  loading: boolean;
  spec: any;
  scenaris: any[];
  errorWhileFetching: boolean;
  currentScenario: any;
}

// tslint:disable-next-line:no-empty-interface
interface IAppProps {
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props)

    this.state = {
      currentScenario: undefined,
      errorWhileFetching: false,
      loading: true,
      scenaris: [],
      spec: {},
      specUrl: 'http://petstore.swagger.io/v2/swagger.json',
    }
  }

  public componentDidMount() {
    this.loadSpec(this.state.specUrl)
  }
  

  public loadSpec(specUrl: string) {
    this.setState({ loading: true })
    fetch(specUrl).then(response => response.json()).then((spec) => {
      if (spec.swagger && spec.swagger === '2.0') {
        const specConverterOption = {
          patch: true,
          warnOnly: true,
        }
        converter.convertObj(spec, specConverterOption).then((convertedOption: any) => {
          const preparedSpec = this.prepareSpec(convertedOption.openapi, convertedOption.openapi)
          this.setState({ loading: false, specUrl, spec: preparedSpec, errorWhileFetching: false })
        });
      } else if (spec.openapi) {
        const preparedSpec = this.prepareSpec(spec, spec)
        this.setState({ loading: false, specUrl, spec: preparedSpec, errorWhileFetching: false })
      } else {
        this.setState({ loading: false, specUrl, errorWhileFetching: true })
      }
    }).catch((e) => this.setState({ loading: false, specUrl, errorWhileFetching: true }))
  }

  // Inline JSON references
  public prepareSpec(fullSpec: any, spec: any): any {
    if(Array.isArray(spec)) {
      return spec.map(key => this.prepareSpec(fullSpec, key))
    }
    if (typeof spec === 'object') {
      Object.keys(spec).forEach(key => {
        if (key === '$ref') {
          const path = spec[key].replace("#/", "").split("/")
          let fullSpecPart = fullSpec[path[0]][path[1]]
          for(let i = 2; i < path.length; i++) {
            fullSpecPart = fullSpecPart[path[i]];
          }
          spec = fullSpecPart
        } else {
          spec[key] = this.prepareSpec(fullSpec, spec[key])
        }
      })
    }
    return spec
  }

  public addScenario() {
    const scenaris = this.state.scenaris;
    const id = scenaris.length + 1;
    const newScenario = {
      id,
      name: 'Scenario #' + id,
      specUrl: this.state.specUrl,
    };

    scenaris.push(newScenario);
    this.setState({ scenaris });
    this.setCurrentScenarioTo(newScenario);
  }

  public removeScenario(scenario: any) {
    const scenaris = this.state.scenaris
    const newSceanris = scenaris.map(scenar => {
      if (scenar.id === scenario.id) {
        return undefined
      }
      return scenar
    }).filter(scenar => scenar !== undefined)
    this.setState({ scenaris: newSceanris })
  }

  public setCurrentScenarioTo(scenario: any) {
    this.setState({ currentScenario: scenario });
  }

  public onPathDropped(pathProps: any, scenario: any) {
    const { color, method, path, summary, disabled, spec } = pathProps;

    const scenaris = this.state.scenaris
    let currentScenario;
    const newSceanris = scenaris.map(scenar => {
      if (scenar.id === scenario.id) {
        if (!scenar.paths) { scenar.paths = [] }
        scenar.paths.push({type:'PATH',id: scenar.paths.length + 1,color, method, path, summary, disabled, spec})
        currentScenario = scenar
        return scenar
      }
      return scenar
    })

    this.setState({scenaris: newSceanris, currentScenario})
  }

  public onSecurityDefinitionDropped(securityDefinitionProps: any, scenario: any) {
    const { spec, name } = securityDefinitionProps

    const scenaris = this.state.scenaris
    let currentScenario;
    const newSceanris = scenaris.map(scenar => {
      if (scenar.id === scenario.id) {
        if (!scenar.paths) { scenar.paths = [] }
        scenar.paths.push({type: 'SECURITY_DEFINITION', spec, name, id: scenar.paths.length + 1})
        currentScenario = scenar
        return scenar
      }
      return scenar
    })

    this.setState({scenaris: newSceanris, currentScenario})
  }

  public onHelperDropped(helperProps: any, scenario: any) {
    const { name } = helperProps

    const scenaris = this.state.scenaris
    let currentScenario;
    const newSceanris = scenaris.map(scenar => {
      if (scenar.id === scenario.id) {
        if (!scenar.paths) { scenar.paths = [] }
        scenar.paths.push({type: 'HELPER', name, id: scenar.paths.length + 1})
        currentScenario = scenar
        return scenar
      }
      return scenar
    })

    this.setState({scenaris: newSceanris, currentScenario})
  }

  public onAssertionsChange(path: any, assertions: any) {
    const scenaris = this.state.scenaris
    const newSceanris = scenaris.map(scenar => {
      if (scenar.id === this.state.currentScenario.id) {
        const newPaths = scenar.paths.map((p: any) => {
          if (p.id === path.id) {
            p.assertions = assertions;
            return p
          }
          return p
        })
        scenar.paths = newPaths
        return scenar
      }
      return scenar
    })

    this.setState({scenaris: newSceanris})
  }

  public onExtractionsChange(path: any, extractions: any) {
    const scenaris = this.state.scenaris
    const newSceanris = scenaris.map(scenar => {
      if (scenar.id === this.state.currentScenario.id) {
        const newPaths = scenar.paths.map((p: any) => {
          if (p.id === path.id) {
            p.extractions = extractions;
            return p
          }
          return p
        })
        scenar.paths = newPaths
        return scenar
      }
      return scenar
    })

    this.setState({scenaris: newSceanris})
  }

  public onTestValueChange(path: any, paramName: string, value: string) {
    const scenaris = this.state.scenaris
    const newSceanris = scenaris.map(scenar => {
      if (scenar.id === this.state.currentScenario.id) {
        const newPaths = scenar.paths.map((p: any) => {
          if (p.id === path.id) {
            if (!p.testValues) { p.testValues = {} }
            p.testValues[paramName] = value
            return p
          }
          return p
        })
        scenar.paths = newPaths
        return scenar
      }
      return scenar
    })

    this.setState({scenaris: newSceanris})
  }

  public render() {
    const { scenaris, currentScenario } = this.state

    return (
        <Container>
          <Grid divided={true}>
            <Grid.Row style={{ paddingTop: 0, paddingBottom: 0 }}>
              <Grid.Column width={5}>
                <Container style={leftPane}>
                  <Divider hidden={true} />
                  <Input
                    fluid={true}
                    loading={this.state.loading}
                    error={this.state.errorWhileFetching}
                    value={this.state.specUrl}
                    onChange={(e: any) => { this.loadSpec(e.target.value) }}
                    placeholder='Insert swagger spec url here...' />
                  <Divider hidden />
                  {Object.keys(this.state.spec).length > 0 &&
                    <React.Fragment>
                      <Divider horizontal>Security Definitions</Divider>
                      <SecurityDefinitions spec={this.state.spec} onDropped={(props, dropResult) => this.onSecurityDefinitionDropped(props, dropResult)} />
                      <Divider horizontal>Helpers</Divider>
                      <Helpers onDropped={(props, dropResult) => this.onHelperDropped(props, dropResult)} />
                      <Divider horizontal>Paths</Divider>
                      <Paths spec={this.state.spec} onDropped={(props, dropResult) => this.onPathDropped(props, dropResult)} />
                    </React.Fragment>
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
                          <Button basic color='green' icon='play'/>
                          <Button basic color='green' icon='forward'/>
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
                  {currentScenario && 
                    <Scenario
                      onAssertionsChange={(path: any, assertions: any[]) => this.onAssertionsChange(path, assertions)}
                      onExtractionsChange={(path: any, extractions: any[]) => this.onExtractionsChange(path, extractions)}
                      onTestValueChange={(path: any, paramName: string, value: string) => this.onTestValueChange(path, paramName, value)}
                      scenario={currentScenario} />}
                </Container>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
    );
  }
}

export default App;

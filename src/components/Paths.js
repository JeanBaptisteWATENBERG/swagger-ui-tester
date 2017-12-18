import React, { Component } from 'react'
import Path from './Path.js'

class Paths extends Component {
    render() {
        const { spec, onDropped } = this.props
        
        return (
            <div>
                {spec && Object.keys(spec.paths).map((path, i) =>
                    Object.keys(spec.paths[path]).map(
                        (method, j) => {
                            if (spec.paths[path][method].deprecated) {
                                return <Path
                                    key={(i+1)*(j+1)}
                                    onDropped={(props, dropResult) => onDropped(props, dropResult)}
                                    spec={spec.paths[path][method]}
                                    testValues={{}}
                                    color='black'
                                    disabled
                                    path={path}
                                    method={method.toUpperCase()}
                                    summary={spec.paths[path][method].summary} />
                            }
                            switch (method.toLowerCase()) {
                                case "get":
                                    return <Path
                                        key={(i+1)*(j+1)}
                                        onDropped={(props, dropResult) => onDropped(props, dropResult)}
                                        spec={spec.paths[path][method]}
                                        testValues={{}}
                                        color='blue'
                                        path={path}
                                        method={method.toUpperCase()}
                                        summary={spec.paths[path][method].summary} />
                                case "post":
                                    return <Path
                                        key={(i+1)*(j+1)}
                                        onDropped={(props, dropResult) => onDropped(props, dropResult)}
                                        spec={spec.paths[path][method]}
                                        testValues={{}}
                                        color='green'
                                        path={path}
                                        method={method.toUpperCase()}
                                        summary={spec.paths[path][method].summary} />
                                case "put":
                                    return <Path
                                        key={(i+1)*(j+1)}
                                        onDropped={(props, dropResult) => onDropped(props, dropResult)}
                                        spec={spec.paths[path][method]}
                                        testValues={{}}
                                        color='orange'
                                        path={path}
                                        method={method.toUpperCase()}
                                        summary={spec.paths[path][method].summary} />
                                case "patch":
                                    return <Path
                                        key={(i+1)*(j+1)}
                                        onDropped={(props, dropResult) => onDropped(props, dropResult)}
                                        spec={spec.paths[path][method]}
                                        testValues={{}}
                                        color='purple'
                                        path={path}
                                        method={method.toUpperCase()}
                                        summary={spec.paths[path][method].summary} />
                                case "delete":
                                    return <Path
                                        key={(i+1)*(j+1)}
                                        onDropped={(props, dropResult) => onDropped(props, dropResult)}
                                        spec={spec.paths[path][method]}
                                        testValues={{}}
                                        color='red'
                                        path={path}
                                        method={method.toUpperCase()}
                                        summary={spec.paths[path][method].summary} />
                                default:
                                    return <Path
                                        key={(i+1)*(j+1)}
                                        onDropped={(props, dropResult) => onDropped(props, dropResult)}
                                        spec={spec.paths[path][method]}
                                        testValues={{}}
                                        color='back'
                                        path={path}
                                        method={method.toUpperCase()}
                                        summary={spec.paths[path][method].summary} />
                            }
                        }
                    )
                )}
            </div>
        )
    }
}

export default Paths
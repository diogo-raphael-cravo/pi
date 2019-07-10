import React, { Component } from 'react';
import Graph from 'react-graph-vis';

const events = {
  select: function(event) {
    /* var { nodes, edges } = event; */
  }
};

class PiGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        layout: {
          hierarchical: {
            enabled: true,
            direction: 'UD',
            sortMethod: 'directed',
          }
        },
        edges: {
          color: "#000000"
        },
        height: "500px"
      },
    };

    this.changeDisplayDirection = this.changeDisplayDirection.bind(this);
  }

  changeDisplayDirection(direction) {
    let opts = this.state.options;
    opts.layout.hierarchical.direction = direction;
    this.setState({ options: opts });
  }

  render() {
    if (!this.props.term) {
      return (<div>
        No graph.
      </div>);
    }
    const graph = this.props.term.toGraph(0);
    return (<div>
      {/* <button onClick={() => this.changeDisplayDirection('LR')}>LR</button>
      <button onClick={() => this.changeDisplayDirection('RL')}>RL</button>
      <button onClick={() => this.changeDisplayDirection('UD')}>UD</button>
      <button onClick={() => this.changeDisplayDirection('DU')}>DU</button> */}
      <Graph
        style={{border: '1px solid black'}}
        graph={graph}
        options={this.state.options}
        events={events}
        getNetwork={network => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
        }}
      />
    </div>);
  }
}

export default PiGraph;
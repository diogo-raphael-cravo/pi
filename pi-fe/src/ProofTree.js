import React, { Component } from 'react';
import Graph from 'react-graph-vis';


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
      graph: {
        nodes: [{
          id: 0,
          label: 'empty',
        }],
        edges: [],
      },
      id: 1,
    };

    this.scMat = this.scMat.bind(this);
    this.selectNode = this.selectNode.bind(this);
  }

  scMat(direction) {
    
    //this.setState({ graph, id: id + 2 });
  }

  selectNode(node) {
    if (node === undefined) {
      return;
    }
    const isEmpty = this.state.graph.nodes.find(x => x.id === node).label === 'empty';
    if (!isEmpty) {
      return;
    }
    this.setState({ selectedNode: node });
  }

  render() {
    const selectNode = this.selectNode;
    const events = {
      select(event) {
        const { nodes } = event;
        selectNode(nodes[0]);
      }
    };
    return (<div>
      <button onClick={() => this.scMat('forward')}>SC-MAT forward</button>
      <button onClick={() => this.scMat('backward')}>SC-MAT backward</button>
      <button onClick={() => this.changeDisplayDirection('UD')}>UD</button>
      <button onClick={() => this.changeDisplayDirection('DU')}>DU</button>
      <Graph
        style={{border: '1px solid black'}}
        graph={this.state.graph}
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
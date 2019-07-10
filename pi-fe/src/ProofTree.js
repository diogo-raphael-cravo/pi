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
      proof: {
        nodes: [{
          id: 0,
          label: '0',
        }, {
          id: 1,
          label: '1',
        }, {
          id: 2,
          label: '2',
        }, {
          id: 3,
          label: '3',
        }, {
          id: 4,
          label: '4',
        }, {
          id: 5,
          label: '5',
        }, {
          id: 6,
          label: '6',
        }],
        edges: [{
          from: 0,
          to: 1,
        }, {
          from: 2,
          to: 3,
        }, {
          from: 4,
          to: 5,
        }, {
          from: 3,
          to: 6,
        }],
      },
      id: 1,
    };

    this.applyRule = this.applyRule.bind(this);
    this.selectNode = this.selectNode.bind(this);
  }

  applyRule(ruleFn) {
    const rule = ruleFn(this.state.selectedNode);
  }

  selectNode(node) {
    if (node === undefined) {
      return;
    }
    const isEmpty = this.state.proof.nodes.find(x => x.id === node).label === 'empty';
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
    const rules = global.pi.Rules;
    return (<div>
      {rules.map(rule => (
        <div>
          <button onClick={() => this.applyRule(rule.forward)}>{rule.NAME()} forward</button>
          <button onClick={() => this.applyRule(rule.backward)}>{rule.NAME()} backward</button>
        </div>
      ))}
      <Graph
        style={{border: '1px solid black', marginTop: 10 }}
        graph={this.state.proof}
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
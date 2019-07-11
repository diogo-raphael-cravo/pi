import React, { Component } from 'react';
import Graph from 'react-graph-vis';
import RulesDisplay from './RulesDisplay';

const options = {
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
};


function justTerm(selectedMethod) {
  return selectedMethod.length < 2;
}

function nameAndTerm(selectedMethod) {
  return selectedMethod.length === 2;
}

class PiGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options,
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
      id: 10,
      selectedRule: null,
      selectedMethod: null,
      name: '',
      term: '',
    };

    this.applyRule = this.applyRule.bind(this);
    this.selectRule = this.selectRule.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);

    this.auxiliarRules = [{
      NAME() {
        return 'Add term';
      },
      apply: (term) => {
        console.log('apply')
        this.setState({
          proof: {
            nodes: [
              {
                id: this.state.id,
                label: `${this.state.id}`,
              },
            ],
          },
          id: this.state.id + 1,
        });
      }
    }];
  }

  handleTermChange(event) {
    this.setState({term: event.target.value});
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  applyRule() {
    if (justTerm(this.state.selectedMethod)) {
      this.state.selectedMethod(global.pi.Parser.parse(this.state.term));
    }
    this.setState({
      selectedRule: null,
      selectedMethod: null,
      name: '',
      term: '',
    });
  }

  selectRule(selectedRule, selectedMethod) {
    this.setState({ selectedRule, selectedMethod });
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
    const disableName = this.state.selectedRule === null || justTerm(this.state.selectedMethod);
    const disableTerm = this.state.selectedRule === null;
    return (<div>
      <div style={{margin: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <RulesDisplay selectRule={this.selectRule} name='Auxiliar' single={true} rules={this.auxiliarRules} />
        <RulesDisplay selectRule={this.selectRule} name='Congruence Relation' single={false} rules={rules.congruence} />
        <RulesDisplay selectRule={this.selectRule} name='Structural Congruence' single={false} rules={rules.structuralCongruence} />
        <RulesDisplay selectRule={this.selectRule} name='Reduction' single={false} rules={rules.reduction} />
      </div>
      <div style={{margin: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <div style={{margin: 10, display: 'flex', flexDirection: 'column'}}>
          {this.state.selectedRule ? this.state.selectedRule.NAME() : 'Choose a rule first'}
          <div style={{ marginTop: 5, marginBottom: 5 }}>
            Name: <input onChange={this.handleNameChange} disabled={disableName} type='text' value={this.state.name}/>
          </div>
          <div style={{ marginTop: 5, marginBottom: 5 }}>
            Term: <input onChange={this.handleTermChange} disabled={disableTerm} type='text' value={this.state.term}/>
          </div>
          <button disabled={this.state.selectedRule === null} onClick={this.applyRule}>Ok</button>
        </div>
      </div>
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
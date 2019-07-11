import React, { Component } from 'react';
import ProofTree from './ProofTree';

class Prover extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }

  render() {
    return (<div>
      <h1>Prover</h1>
      <ProofTree />
    </div>);
  }
}

export default Prover;
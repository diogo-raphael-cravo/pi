import React, { Component } from 'react';
import SyntaxAnalyser from './SyntaxAnalyser';
import Prover from './Prover';

class PiApp extends Component {
  constructor(props) {
    super(props);
    this.state = { showProver: true };

    this.showProver = this.showProver.bind(this);
  }

  showProver(showProver) {
    this.setState({ showProver });
  }

  render() {
    return (<div style={{margin: 10, display: 'flex', flexDirection: 'column'}}>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <button disabled={!this.state.showProver} style={{ width: 200, marginRight: 10 }} onClick={() => this.showProver(false)}>Syntax Analyser</button>
        <button disabled={this.state.showProver} style={{ width: 200 }} onClick={() => this.showProver(true)}>Prover</button>
      </div>
      {this.state.showProver ? <Prover /> : <SyntaxAnalyser />}
    </div>);
  }
}

export default PiApp;
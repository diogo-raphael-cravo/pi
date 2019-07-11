import React, { Component } from 'react';
import PiGraph from './PiGraph';
import TermInformation from './TermInformation';
import Syntax from './Syntax';
import Examples from './Examples';

class SyntaxAnalyser extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    const term = this.state.value === '' ? '' : global.pi.Parser.parse(this.state.value);

    const parser = <div style={{display: 'flex', flexDirection: 'row'}}>
      <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
        <Examples />
        <h2>Input</h2>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <textarea rows='5' cols='33' 
              value={this.state.value}
              onChange={this.handleChange}
              style={{marginRight: 5}}/>
            <TermInformation term={term}/>
          </div>
        </div>
        <Syntax style={{margin: 10}}/>
      </div>

      <div style={{marginLeft: 5, display: 'flex', flexDirection: 'column', flex: 1}}>
        <h2>Syntax tree</h2>
        <PiGraph term={term}/>
      </div>
    </div>;
    return (<div style={{margin: 10, display: 'flex', flexDirection: 'column'}}>
      <h1>Parser</h1>
      {parser}
    </div>);
  }
}

export default SyntaxAnalyser;
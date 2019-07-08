import React, { Component } from 'react';
import PiGraph from './PiGraph';
import TermInformation from './TermInformation';
import Syntax from './Syntax';
import Term from './Term';

class PiApp extends Component {
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

    const examples = [
      'y x.0 | y(z).0',
      '!y x.0 | y(z).0',
      '(x)y x.0 | y(x).0 + [x=y].0',
      '((x)(x(y).x(z).y z.0 | x(w).x(v).v w.0 | x a.x b.0))',
      '((x)(x(u).u(y).u(z).y z.0 | x(t).t(w).t(v).v w.0 | (s)x s.s a.s b.0))',
    ];

    return (
      <div style={{margin: 10, display: 'flex', flexDirection: 'row'}}>
        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <h1>Examples</h1>
          <div>
            <ul style={{listStyle: 'none', paddingLeft: 10}}>
              {examples.map((e, i) => {
                const id = `ex${i}`;
                return (<li key={id}>
                  <Term id={id} term={e}/>
                </li>);
              })}
            </ul>
          </div>

          <h1>Parser</h1>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <textarea id="story" name="story"
                rows="5" cols="33" 
                value={this.state.value} onChange={this.handleChange}
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
      </div>);
  }
}

export default PiApp;
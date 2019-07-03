import React, { Component } from 'react';

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
    const term = global.pi.Parser.parse(this.state.value);
    const parses = term !== null;
    return (
      <div>
        <div style={{display: 'block'}}>
          <label style={{display: 'block'}}>PI Term:</label>
          <textarea id="story" name="story"
                    rows="5" cols="33" value={this.state.value} onChange={this.handleChange}/>
        </div>
        <div style={{display: 'block'}}>
          {this.state.value} parses to {parses ? `${term.print()}` : 'does not parse'}
        </div>
      </div>);
  }
}

export default PiApp;
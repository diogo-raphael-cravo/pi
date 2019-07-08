import React, { Component } from 'react';

class Syntax extends Component {
  constructor(props) {
    super(props);
    this.state = {hidden: true};

    this.toggleHide = this.toggleHide.bind(this);
  }

  toggleHide() {
    this.setState({hidden: !this.state.hidden});
  }

  render() {
    return (
      <div>
        <b onClick={() => this.toggleHide()}>Syntax (click to {this.state.hidden? 'show' : 'hide'})</b>
        <table style={this.state.hidden? {display:'none'} : {}}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Composition</td><td>P|Q</td></tr>
            <tr><td>Summation</td><td>P+Q</td></tr>
            <tr><td>Inaction</td><td>0</td></tr>
            <tr><td>Match prefix</td><td>[x=y].P</td></tr>
            <tr><td>Negative prefix</td><td>x y.P</td></tr>
            <tr><td>Positive prefix</td><td>x(y).P</td></tr>
            <tr><td>Silent prefix</td><td>t.P</td></tr>
            <tr><td>Restriction</td><td>(y)P</td></tr>
            <tr><td>Replication</td><td>!P</td></tr>
          </tbody>
        </table>
      </div>);
  }
}

export default Syntax;
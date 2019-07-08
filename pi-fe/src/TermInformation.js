import React, { Component } from 'react';
import Term from './Term';

class TermInformation extends Component {
  render() {
    if (this.props.term === null) {
      return (<div>
        Cannot parse this expression.
      </div>);
    }

    if (!this.props.term) {
      return (<div>
        No term information to display.
      </div>);
    }

    const printSet = set => Array.from(set).map(x => x.print())
      .join(', ');
    return (
      <div>
        <p>
          parses to: <br/>
          <Term id='parsed' term={this.props.term.print()}/>
        </p>
        <table style={{border: '1 solid black'}}>
          <thead>
            <tr>
              <th>names</th>
              <th>free</th>
              <th>bound</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{printSet(this.props.term.n())}</td>
              <td>{printSet(this.props.term.fn())}</td>
              <td>{printSet(this.props.term.bn())}</td>
            </tr>
          </tbody>
        </table>
      </div>);
  }
}

export default TermInformation;
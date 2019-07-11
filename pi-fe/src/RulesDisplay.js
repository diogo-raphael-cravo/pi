import React, { Component } from 'react';

class RulesDisplay extends Component {
  render() {
    return (<div style={{margin: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <div style={{margin: 10, display: 'flex', flexDirection: 'column'}}>
        <h3 style={{ textAlign: 'center' }} >{this.props.name}</h3>
        {
          this.props.single ? (
            <div style={{margin: 10, display: 'flex', flexDirection: 'row'}}>
              <div style={{margin: 10, display: 'flex', flexDirection: 'column'}}>
                {this.props.rules.map((rule, key) => (
                  <button key={key} style={{ marginTop: 3 }} onClick={() => this.props.selectRule(rule, rule.apply)}>{rule.NAME()}</button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{margin: 10, display: 'flex', flexDirection: 'row'}}>
              <div style={{margin: 10, display: 'flex', flexDirection: 'column'}}>
                {this.props.rules.map((rule, key) => (
                  <button key={key} style={{ marginTop: 3 }} onClick={() => this.props.selectRule(rule, rule.forward)}>{rule.NAME()} forward</button>
                ))}
              </div>
              <div style={{margin: 10, display: 'flex', flexDirection: 'column'}}>
                {this.props.rules.map((rule, key) => (
                  <button key={key} style={{ marginTop: 3 }} onClick={() => this.props.selectRule(rule, rule.backward)}>{rule.NAME()} backward</button>
                ))}
              </div>
            </div>
          )
        }
      </div>
    </div>);
  }
}

export default RulesDisplay;
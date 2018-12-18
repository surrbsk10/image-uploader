import React, { Component } from 'react';
import Request from 'superagent';
import './App.css';

const styles = {
  col1: {
    width: '5%'
  },
  col2: {
    width: '30%'
  },
  col3: {
    width: '65%'
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      fileNames: [],
      files:  null,
      progressArray: []
    };

    this.handleFiles = this.handleFiles.bind(this);
    this.renderProgressTable = this.renderProgressTable.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  handleFiles({ target }) {
    console.log(target);
    let { progressArray } = this.state;
    if(target.files.length > 0) {
      let fileNames = Array.from(target.files).map(file => file.name);
      for(let i=0; i<fileNames.length; i++) progressArray.push(0);
      this.setState({ fileNames, progressArray, files: target.files });
    }
  }

  uploadFiles() {
    let { files } = this.state;
    for(let i=0; i<files.length; i++) {
      Request
        .post('http://192.168.43.9:8080/api/uploadFiles')
        .set('Access-Control-Allow-Origin', '*')
        .attach('file', files[i])
        .on('progress', e => {
            if(e.direction == 'upload') {
              let { progressArray } = this.state;
              progressArray[i] = e.percent;
              this.setState({ progressArray });
              console.log(e.direction, 'progress: ', e.percent);
            }
         })
        .end((err, res) => { console.log('Resopsne', res, '\nError', err); });
    }
  }

  shorten(str) {
    if(str.length > 15) {
      return str.slice(0, 13) + '..';
    }
    return str;
  }

  renderProgressTable() {
    let { fileNames, progressArray } = this.state;
    return (
      <table>
        <tbody>
          {
            fileNames.map((name, index) => (
              <tr key={index}>
                <td style={styles.col1}>{ index + 1 }</td>
                <td style={styles.col2}>{ this.shorten(name) }</td>
                <td style={styles.col3} className='ProgressBar'>
                  <div style={{ width: progressArray[index] + '%' }}>
                  ||||||
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className='App'>
        <div className='Left'>
          <div className='Top'>
            <h3>Upload Image(s)</h3>
              <form>
                <input type='file' multiple onChange={this.handleFiles} />
                <input type="button" name="upload" value= "upload" onClick={this.uploadFiles}/>
              </form>
          </div>
          <div className='Bottom'>
            <h3>Upload Progress</h3>
            { this.renderProgressTable() }
          </div>
        </div>
        <div className='Divider'>

        </div>

        <div className='Right'>

        </div>
      </div>
    );
  }
}

export default App;

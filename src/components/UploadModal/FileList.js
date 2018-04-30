import React, { Component } from 'react';
import ProgressBar from 'react-fine-uploader/progress-bar';


class FileList extends Component {

    render() {
        if (this.props.files.length) {
            return (
                <div className="fileList">
                    <table className="table table-sm fileList">
                        <thead>
                            <tr><th>Name</th><th>Description</th><th></th></tr>
                        </thead>
                        <tbody>
                            {this.props.files.map((row, i) => {
                                return <tr key={i}><td>{row.name}</td><td>{row.fileMetadata}</td><td>{this.props.uploader && <ProgressBar id={row.id} uploader={this.props.uploader}/>}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            )
        }

        return <p><em>No files attached.</em></p>        
    }
}

export default FileList
import React, { Component } from 'react';


import './App.css';
import LoginScreen from './Loginscreen';
import UploadScreen from './Uploadscreen';
import UploadPage from './UploadPage';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
    // khởi tạo component
    constructor(props){
        // super(props) để có thể sử dụng this.props trong constructor.
        super(props);

        // khai báo state với 2 array : loginPage và uploadScreen
        this.state={
            loginPage:[],
            uploadScreen:[]
        }
    }

    // hàm thực hiện 1 lần, trong vòng đời của component.
    componentWillMount(){
        var loginPage =[];
        loginPage.push(<LoginScreen appContext={this}/>);
        this.setState({
            loginPage:loginPage
        })
    }
    render() {
        return (
            <div className="App">
                {this.state.loginPage}
                {this.state.uploadScreen}
            </div>
        );
    }
}

const style = {
    margin: 15,
};

export default App;
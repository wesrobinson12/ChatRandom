import React from 'react';
import injectSheet from 'react-jss';
import superagent from 'superagent';
import { receiveSessionUser } from '../../actions/chatActions';
import { connect } from 'react-redux';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textInput: ''
    };

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onUsernameChange(e) {
    this.setState({ textInput: e.currentTarget.value });
  }

  onSubmit(e) {
    let { textInput } = this.state;
    let { history, receiveSessionUser } = this.props;

    e.preventDefault();

    receiveSessionUser(textInput);
    this.setState({ textInput: '' },
      () => history.push('/chat'));
  }

  render() {
    let { classes } = this.props;
    let { textInput } = this.state;

    return (
      <div className={classes.loginPageContainer}>
        <div className={classes.pageHeader}>
          Enter a username to get started
        </div>
        <form type='submit' className={classes.formBox} onSubmit={this.onSubmit}>
          <input
            type='text'
            value={textInput}
            placeholder='Username'
            className={classes.inputBox}
            onChange={this.onUsernameChange}>
          </input>
          <input
            type='submit'
            className={classes.submitButton}
            value='Continue'>
          </input>
        </form>
      </div>
    );
  }
}

const styles = {
  loginPageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pageHeader: {
    fontSize: '24px',
    margin: '100px 0'
  },
  formBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputBox: {
    fontSize: '24px',
    marginBottom: '20px',
    padding: '5px 10px'
  },
  submitButton: {
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '24px',
    background: '#006df0',
    color: '#fff',
    cursor: 'pointer',
    '&:hover': {
      background: '#1c7ff7'
    }
  }
};

const mapDispatchToProps = (dispatch) => ({
  receiveSessionUser: (user) => dispatch(receiveSessionUser(user))
});

export default connect(
  null,
  mapDispatchToProps
)(injectSheet(styles)(LoginPage));

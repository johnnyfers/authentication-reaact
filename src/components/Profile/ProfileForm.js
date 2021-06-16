import classes from './ProfileForm.module.css';
import {useRef, useContext} from 'react'
import AuthContext from '../../store/authContext'
import { useHistory } from 'react-router-dom'


const ProfileForm = () => {
  const newPasswordInputRef = useRef()
  const authCtx = useContext(AuthContext)

  const history = useHistory()

  const submitHandler = (event)=> {
    event.preventDefault()

    const enteredPassword = newPasswordInputRef.current.value

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyA7ARFHNsvNa9JyyNZw6ZyIT-LCopdTKd4',{
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      history.replace('/')
    })
  }

  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minlength='7' ref={newPasswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;

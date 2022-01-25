import React, {useState} from 'react'

const UserLogin = () => {
    const [form,setForm] = useState({email:'',password:''})
	
    const loginHandler = async(e)=>{
		e.preventDefault();
		console.log(form);

	}

    const passwordChangeHandler = (e) => {
        setForm({...form, password: e.target.value})
    }
    
    const emailChangeHandler = (e) => {
        setForm({...form, email: e.target.value})
    }
	// const InputFields = {
	// 	padding:'0.5rem',
	// 	margin:'0.8rem',
	// 	borderRadius: '4px'
	// }
	// const ButtonStyle = {
	// 	borderRadius: '4px',
	// 	padding:'0.7rem',
	// 	margin:'0.5rem'
	// }
	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={loginHandler} >
			<label htmlFor="email">Email</label>
			<input type="text" placeholder="email" id="mail" onChange={emailChangeHandler} />
			<br/>
			<label htmlFor="password">Password</label>
		    <input type="password" placeholder="Password" onChange={passwordChangeHandler}/>
			<br/>
			<button type="submit">
				Submit
			</button>
			</form>
		</div>
    )
}

export default UserLogin;

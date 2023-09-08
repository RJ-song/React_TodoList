import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

const site = 'https://todolist-api.hexschool.io'

function SignIn(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [token,setToken] = useState('');

    const handleSignIn = async() =>{
        try{
          const response = await axios.post(`${site}/users/sign_in`,{
            email: email,
            password: password,
          })
          setToken('登入成功' + response.data.token);
        }
        catch(e){
          setToken('登入失敗:' + e.message);
        }
      };
    return (
        <div id="loginPage" className="bg-yellow">
      <div className="container loginPage vhContainer">
        <div className="side">
          <a href="#"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></a>
          <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
        </div>
        <div>
          <form className="formControls" action="index.html">
            <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
            <label className="formControls_label" htmlFor="email">Email</label>
            <input className="formControls_input" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   type="email" 
                   id="email" 
                   name="email" 
                   placeholder="請輸入 email" required />
            <span>此欄位不可留空</span>
            <label className="formControls_label" htmlFor="pwd">密碼</label>
            <input className="formControls_input" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   type="password" 
                   name="pwd" 
                   id="pwd" 
                   placeholder="請輸入密碼" required />
            <input
                   className="formControls_btnSubmit"
                   type="button"
                   onClick={handleSignIn}
                   value="登入"/>
            <p><h2>Token:</h2> {token}</p>
            <a className="formControls_btnLink" href="#signUpPage">註冊帳號</a>
          </form>
        </div>
      </div>
    </div>
      )
}

export default SignIn;
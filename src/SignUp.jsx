import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { useNavigate }  from "react-router-dom";
import { Link } from "react-router-dom";

const site = 'https://todolist-api.hexschool.io'

function SignUp(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [nickname,setNickname] = useState('');
    const navigate = useNavigate();
    const [popupVisible, setPopupVisible] = useState(false);
    const [error, setError] = useState('');

  const handleSignUp = async() => {
    try{
      const response = await axios.post(`${site}/users/sign_up`,{
        email,
        password,
        nickname,
      });
      setMessage("註冊成功 UID:" + response.data.uid)
      navigate("/SignIn")
      
    }
    catch(e){
      setError("註冊失敗" + e.message)
      setPopupVisible(true);
    }
  };
    return (
        <div id="signUpPage" className="bg-yellow">
      <div className="container signUpPage vhContainer">
        <div className="side">
          <a href="#"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></a>
          <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
        </div>
        <div>
          <form className="formControls" action="index.html">
            <h2 className="formControls_txt">註冊帳號</h2>
            <label className="formControls_label" htmlFor="email">Email</label>
            <input className="formControls_input" 
                   value={email} 
                   onChange={(e) => setEmail(e.target.value)} 
                   type="email" 
                   id="email" 
                   name="email" 
                   placeholder="請輸入 email" required />
            <label className="formControls_label" htmlFor="name">您的暱稱</label>
            <input className="formControls_input" 
                   value={nickname}
                   onChange={(e) => setNickname(e.target.value)}
                   type="text" 
                   name="name" 
                   id="name" 
                   placeholder="請輸入您的暱稱" />
            <label className="formControls_label" htmlFor="pwd">密碼</label>
            <input className="formControls_input" 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   name="pwd" 
                   id="pwd" 
                   placeholder="請輸入密碼" required />
            <input
                   className="formControls_btnSubmit"
                   type="button"
                   onClick={handleSignUp}
                   value="註冊帳號"/>
            <Link to="/" className="formControls_btnLink">登入</Link>
          </form>
        </div>
      </div>
      <div className={`popup ${popupVisible ? 'show' : ''}`}>
          <p>{error}</p>
          <button onClick={() => {
          setPopupVisible(false); // 關閉彈出視窗
          }}>確定</button>
      </div>
    </div>
      )
}

export default SignUp;
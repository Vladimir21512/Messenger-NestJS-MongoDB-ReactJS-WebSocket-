import React, {useContext, useState} from 'react';
import {registration} from "../http/userAPI";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import {MAIN_ROUTE} from "../router/path";
import AvatarEditor from 'react-avatar-editor'

const Auth = () => {
    const {user}=useContext(Context)
    const history = useNavigate()
    const [email,setEmail]= useState('')
    const [password,setPassword]= useState('')
    const [reppassword,setRepPassword]= useState('')
    const [nickname,setNickName]= useState('')
    const [name,setName]= useState('')
    const [file,SetFile]=useState()
    const sendRegistration=()=>{

        if(email=='' || email.trim()==''){
            alert('Email field is empty')
        }
        else if(password!=reppassword){
            alert("Passwords don't match")
        }
        else if(name.trim()=='' || name==''){
            alert('Name field is empty')
        }
        else{
            let formdata = new FormData()
            formdata.append('name',name)
            formdata.append('email',email)
            formdata.append('password',password)
            formdata.append('nickname',nickname)
            //formdata.append('contacts',[])
            formdata.append('LastVisit','')
            formdata.append('refreshtoken','')
            formdata.append('file',file)
            registration(formdata).then(e=> {
                user.setIsAuth(true)
                localStorage.setItem('token',e['accessToken'])
            }).then(a=>{history(MAIN_ROUTE)})
            // registration({name:name,nickname:nickname,email:email,password:password,contacts:[],LastVisit:'', refreshtoken:'', file:file}).then(e=> {
            //     user.setIsAuth(true)
            //     localStorage.setItem('token',e['accessToken'])
            // }).then(a=>{history(MAIN_ROUTE)})
        }
    }
    return (
        <div className='Auth'>
            <input onChange={(e)=>setEmail(e.target.value)} className='authForm' placeholder='email' type="text"/>
            <input onChange={(e)=>setPassword(e.target.value)} className='authForm' placeholder='password' type="text"/>
            <input onChange={(e)=>setRepPassword(e.target.value)} className='authForm' placeholder='repeat password' type="text"/>
            <input onChange={(e)=>setName(e.target.value)} className='authForm' placeholder='name' type="text"/>
            <input onChange={(e)=>setNickName(e.target.value)} className='authForm' placeholder='nickname' type="text"/>

            <h1 style={{marginTop:'20px'}}>Avatar:</h1>

            {file &&
                <img style={{width:'40%', marginTop:'20px'}} src={URL.createObjectURL(file)} alt=""/>
            }

            <input style={{marginTop:'20px'}} type="file" onChange={(e)=> {
                SetFile(e.target.files[0])
            }}/>
            <button style={{marginTop:'50px'}} onClick={()=>sendRegistration()} className='authButton'>Registration</button>
        </div>
    );
};

export default Auth;
import React, { useEffect } from 'react';

import {GoogleLogin} from 'react-google-login';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
// import {FcGoogle} from 'react-icons/fc';
import {client} from '../client'
import shareVideo from '../assets/video.mp4';
import logo from '../assets/logotrans.png';
const Login = () => {
  const navigate = useNavigate();
  function handleCallbackRespose(response){
      console.log("Encoded JWT ID token:"+response.credential)
      var decodedHeader = jwt_decode(response.credential);
      console.log(decodedHeader);
      localStorage.setItem('user',JSON.stringify(decodedHeader))
      const { name, sub, picture } = decodedHeader;

    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,
    }
    client.createIfNotExists(doc)
      .then(() =>{
        navigate('/', { replace: true })
      })
  }
  useEffect(()=>{
    /* global google */
      google.accounts.id.initialize({
      client_id:"423821622652-2hs6m1e4pqs8oojfhkn2ffhlj46plhh9.apps.googleusercontent.com",
      callback: handleCallbackRespose
  });

  google.accounts.id.renderButton(
    document.getElementById("signInDiv"),
    {theme:"outline", size:"large"}
  )

  google.accounts.id.prompt();
  },[]);

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full" >
          <video 
            src={shareVideo}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className="w-full h-full object-cover"
          />
          <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
              <div className="p-5">
                <img src={logo} width="130px" alt="logo" />
              </div>
              <div id='signInDiv'>
                <GoogleLogin 
                clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                onSuccess={handleCallbackRespose}
                onFailure={handleCallbackRespose}
                cookiePolicy="single_host_origin"
                >
                <button type='button' className='big-maincolor'>
                  Sign in with Google
                </button>
                </GoogleLogin>
              </div>
          </div>
      </div>
    </div>
  )
}

export default Login

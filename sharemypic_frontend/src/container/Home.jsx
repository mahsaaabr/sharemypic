import React,{useState,useRef,useEffect} from 'react';
import {HiMenu} from 'react-icons/hi';
import {AiFillCloseCircle} from 'react-icons/ai';
import {Link , Route, Routes} from 'react-router-dom';
import { userQuery } from '../utils/data';
import {Sidebar, UserProfile } from '../component';
import Pins from './Pins'
import {client} from '../client';
import logo from '../assets/logotrans.png';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
  const [toggleSidebar,settoggleSidebar]=useState(false); 
  const [user,setUser]=useState(null);
  const userInfo=fetchUser();
  const scrollRef=useRef(null);
  useEffect(()=>{
    const query=userQuery(userInfo?.sub);
    client.fetch(query)
    .then((data)=>{
        setUser(data[0])
    })
  },[]) 

  useEffect(()=>{
    scrollRef.current.scrollTo(0,0)
    
  },[]) 
 
  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user && user}/>
      </div>
      <div className='flex md:hidden flex-row'>
          <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className='cursor-pointer' onClick={()=>settoggleSidebar(true)}/>
          <Link to='/'>
            <img src={logo} alt="logo" className='w-28' />
          </Link>
          <Link to={`user-profile/${user?._id}`}> 
            <img src={userInfo?.picture} alt="logo"  className='w-28' />
          </Link>
      </div>
      {toggleSidebar && (
        <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
          <div className='absolute w-full flex justify-end items-center p-2'>
            <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={()=>settoggleSidebar(false)}/>
          </div>
          <Sidebar user={user && user} closeToggle={settoggleSidebar}/>
        </div>
        )}
      </div>
     
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef} > 
          <Routes>
            <Route path='/user-profile/:userId' element={<UserProfile/>}/>
            <Route path='/*' element={<Pins user={user && user}/>}/>
          </Routes>
      </div>
    </div>
  )
}

export default Home
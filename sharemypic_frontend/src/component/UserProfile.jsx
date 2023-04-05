import React,{useState,useEffect} from 'react';
import {AiOutlineLogout} from 'react-icons/ai';
import { useParams,useNavigate, Link } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImage='https://source.unsplash.com/4200x2200/?nature,photography,technology'

const activeBtnStyle='bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyle='bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';


const  UserProfile= () => {
  const [ user , setUser ] = useState(null);
  const [ pins , setPins ] = useState(null);
  const [ text , setText ] = useState('created');//created | save
  const [ activeBtn , setActivBtn ] = useState('created');
  const navigate = useNavigate();
  const {userId} = useParams();

  useEffect(()=>{
    const query=userQuery(userId);

    client.fetch(query)
      .then((data)=>{
        setUser(data[0])
      })
  },[userId])

  useEffect(()=>{
    if(text === 'created'){
      const createdPinsQuary = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuary)
        .then((data) => {
          setPins(data);
        })
    }else{
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery)
        .then((data) => {
          setPins(data);
        })

    }
  },[text,userId])

  const logout= () => {
    localStorage.clear();

    navigate(`/login`);
    console.log('succes')
  }
  

  if(!user){

    return <Spinner message='Loading profile...'/>
  
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col items-center justify-center'>
            <img 
              src={randomImage}
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
              alt="banner-pic"
             />
             <img 
              src={user.image}
              className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover' 
              alt="user-pic"
             />
             <h1 className='font-bold text-2xl text-center mt-3'>
              {user.userName}
             </h1>
             <div className='absolute top-0 z-1 right-0 p-2'>
              {userId === user?._id && 
                (
                  
                    <button
                      type='button'
                      className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md '
                      onClick={logout}
                      // disabled={renderProps.disabled}
                      // onLogoutSuccess={logout}
                      cookiePolicy="single_host_origin"
                      >
                    <AiOutlineLogout color='red' fontSize={21}/>
                    </button>
        
                )}
                {/* (<GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  onClick={logout}
                  cookiePolicy="single_host_origin"
                  render={(renderProps)=>(
                    
                    <button
                      type='button'
                      className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md '
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      onLogoutSuccess={logout}
                      cookiePolicy="single_host_origin"
                      >
                    <AiOutlineLogout color='red' fontSize={21}/>
                    </button>
      
                  )}
                 
                /> 
              )} */}
             </div>
          </div>
          <div className='text-center mb-7'>
              <button 
              type='button'
              onClick={(e)=>{
                setText('created');
                setActivBtn('created')
              }}
              className={`${activeBtn === 'created' ? activeBtnStyle : notActiveBtnStyle }`}
              >
                Created
              </button>
              <button 
              type='button'
              onClick={(e)=>{
                setText('saved');
                setActivBtn('saved')
              }}
              className={`${activeBtn === 'saved' ? activeBtnStyle : notActiveBtnStyle }`}
              >
                Saved
              </button>
          </div>
          {pins?.length ? (
            <div className='px-2'>
              <MasonryLayout pins={pins}/>
            </div>
          ): (
            <div className='flex justify-center items-center font-bold text-xl mt-2 '>
              No Pins Found
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default UserProfile
import React, { useState } from 'react';
import logo from '../assets/logo.jpg';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState("");
    const [userName, setUserName] = useState("");

    const createNewRoom = () => {
        const id = uuidv4();
        setRoomId(id);

        toast.success('Created New Room', {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!roomId || !userName){
            toast.error('ROOM ID and USERNAME are required', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            return;
        }

        navigate(`/editor/${roomId}`, {
            state: {
                userName
            }
        });
    }

    return (
        <div className='bg-slate-900 w-[100vw] h-[100vh] flex justify-center items-center relative'>
            <div className='w-[340px] lg:w-[350px] h-[300px] bg-gray-200 p-4'>
                <div className='flex'>
                    <img src={logo} alt="CodeShare" className='w-[200px]'/>
                </div>

                <div className='mt-4 font-bold text-gray-900'>
                    <p>Paste Invitaion ROOM ID</p>
                </div>

                <form>

                    <div className='my-2 flex flex-col gap-2'>
                        <input type="text" value={roomId} name="roomId" onChange={(e) => setRoomId(e.target.value)} placeholder='ROOM ID' className='w-full bg-gray-900 text-gray-200 py-1 px-2 rounded-sm'/>
                        <input type="text" value={userName} name="userName" onChange={(e) => setUserName(e.target.value)} placeholder='USERNAME' className='w-full bg-gray-900 text-gray-200 py-1 px-2 rounded-sm'/>
                    </div>

                    <div>
                        <button onClick={handleSubmit} className='border-[2px] border-gray-900 rounded-sm mt-1 py-[1px] px-3 font-bold duration-300 hover:bg-gray-900 hover:text-gray-200'>
                            Join Now
                        </button>
                    </div>
                </form>

                <div className='mt-5 font-bold'>
                    <p>Don't have an Invite? Create <span onClick={createNewRoom} className='text-orange-500 cursor-pointer border-b-2 border-orange-500 duration-300 hover:text-orange-400'>New Room</span></p>
                </div>
            </div>

            <div className='absolute bottom-2'>
                <p className='text-white'>Created with ❤ by <span className='text-lg cursor-pointer text-orange-500 duration-300 hover:text-orange-400'>Dhruv</span></p>
            </div>

            <ToastContainer />
        </div>
    )
}

export default Home
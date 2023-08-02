import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import logoEditorPage from '../assets/logoEditorPage.jpg';
import { socketInit } from '../socket';
import Editor from './Editor';
import User from './User';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {RxHamburgerMenu, RxCross1} from 'react-icons/rx';

function EditorPage() {
    // Extracting roomId information from URL
    const {roomId} = useParams();

    // Extracting data sent along with useNavigate() Hook
    const location = useLocation();

    // Navigating to home page after leave (different from <Navigate /> component)
    const navigate = useNavigate();

    // for displaying users who have joined
    const [users, setUsers] = useState([]);

    // for responsive design
    const [mobile, setMobile] = useState(true);

    // if data will change then component will not re-render + can access DOM elemets and property
    const socketRef = useRef(null);
    const codeRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            // connecting socket.io-client to socket.io server
            socketRef.current = await socketInit();

            // Handling Errors
            socketRef.current.on('connect_error', (err) => errorInfo(err));
            socketRef.current.on('connect_failed', (err) => errorInfo(err));
            
            const errorInfo = (e) => {
                toast.error('Socket connection failed. Try again later', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                navigate('/');
            }

            // Sending join event to server from client + sending roomId and userName
            socketRef.current.emit('join', {
                roomId,
                userName: location.state?.userName,
            });

            // Server will send confirmation that user is joined
            socketRef.current.on('joined', ({clients, userName, socketId}) => {
                // we will not show a toast msg to you 
                // if you entered Dhruv and click enter then it will not sow that Dhruv joined room to you
                if(userName !== location.state?.userName){
                    toast.success(`${userName} joined room`, {
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

                // setting up all users list
                setUsers(clients);

                if(codeRef.current !== null){
                    socketRef.current.emit('syncCode', {
                        socketId,
                        code: codeRef.current,
                    });
                }
            });

            // If user disconnect from the server
            socketRef.current.on('disconnected', ({socketId, userName}) => {
                toast.warn(`${userName} left the room`, {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // removing user from userlist
                setUsers((prev) => {
                    return prev.filter((currUser) => currUser.socketId !== socketId);
                });
            });
        };

        init();
    }, []);

    // function for copying roomId to clipboard
    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        toast.success('ROOM ID copied sucessfully', {
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

    // function for leaving room
    const leaveRoom = () => {
        navigate('/');
    }

    // if userName not found then navigating to home page
    // <Navigate to='PATH'/> inbuilt component in react-router-dom
    if(!location.state){
        return <Navigate to='/' />
    }

  return (
    <div className='lg:flex h-screen overflow-x-hidden max-w-screen'>
        <div className={`bg-gray-900 max-w-[100vw] overflow-hidden duration-500 ${mobile ? 'h-[65px]' : 'h-[80vh]'} lg:h-auto lg:w-[270px] px-2 flex flex-col justify-between`}>
            <div>
                <div className='flex justify-around lg:justify-center items-center mt-1 mb-2'>
                    <img src={logoEditorPage} alt="CodeShare" className="w-[150px] lg:w-[200px]"/>
                    {
                        mobile ? <RxHamburgerMenu onClick={(prev) => setMobile(!prev)} className='text-gray-200 lg:hidden' size={30}/> : <RxCross1 onClick={(prev) => setMobile(true)} className='text-gray-200 lg:hidden' size={30}/>
                    }
                </div>

                <hr className='h-px border-0 dark:bg-gray-500'/>

                <h3 className='text-gray-200 font-extrabold text-xl my-3 sm:pl-5 lg:pl-0'>Connected Users</h3>
                {/* <hr className='h-px border-0 dark:bg-gray-100'/> */}

                <div className='flex flex-col gap-3 mt-5 sm:pl-5 lg:pl-0'>
                    {
                        users.map((user, index) => {
                            return <User userName={user.userName} key={index}/>
                        })
                    }
                </div>
            </div>

            <div>
                <div className='flex justify-center mb-1'>
                    <button onClick={copyRoomId} className='w-[90%] border-[2px] border-gray-200 text-gray-200 rounded-sm mt-1 py-[1px] px-3 font-bold duration-300 hover:bg-gray-200 hover:text-gray-900'>
                        Copy ROOM ID
                    </button>
                </div>
                <div className='flex justify-center mb-3'>
                    <button onClick={leaveRoom} className='w-[90%] border-[2px] border-orange-500 bg-orange-500 text-gray-900 rounded-sm mt-1 py-[1px] px-3 font-bold duration-300 hover:bg-gray-900 hover:text-gray-200 hover:border-gray-200'>
                        Leave ROOM
                    </button>
                </div>
            </div>
        </div>

        <div className='bg-gray-800 lg:overflow-x-hidden w-[100vw] lg:w-[89%] h-[100vh]'>
            <Editor socketRef={socketRef} roomId={roomId} 
            onCodeChange={(code) => {
                codeRef.current = code;
            }}/>
        </div>

        <ToastContainer />
    </div>
  )
}

export default EditorPage
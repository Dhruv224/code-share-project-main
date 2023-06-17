import {io} from 'socket.io-client';

export const socketInit = async () => {
    const options = {
        'force new connection': true,
    }

    // console.log(process.env.REACT_APP_BACKEND_URL);

    return io('http://localhost:3000', options)
}
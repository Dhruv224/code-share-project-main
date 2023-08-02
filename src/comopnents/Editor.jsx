import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import {dracula} from '@uiw/codemirror-theme-dracula';
import { darcula } from '@uiw/codemirror-theme-darcula';
import { sublime } from '@uiw/codemirror-theme-sublime';
import { aura } from '@uiw/codemirror-theme-aura';
import { duotoneLight, duotoneDark } from '@uiw/codemirror-theme-duotone';
import { eclipse } from '@uiw/codemirror-theme-eclipse';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { noctisLilac } from '@uiw/codemirror-theme-noctis-lilac';
import { nord } from '@uiw/codemirror-theme-nord';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { ToastContainer, toast } from 'react-toastify';

function Editor({socketRef, roomId, onCodeChange}) {
  const [code, setCode] = useState("// Welcome to \"Code Share - Realtime Code Sharing Editor\"\n// Happy Coding..!!");
  const [theme, setTheme] = useState("Dracula");
  const themeOptions = [
    'Aura',
    'Dracula',
    'Darcula',
    'Duotone Light',
    'Duotone Dark',
    'Eclipse',
    'Github Light',
    'Github Dark',
    'NoctisLilac',
    'Nord',
    'Okaidia',
    'Sublime',
    'TokyoNight',
    'VscodeDark'
  ];
  
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    toast.success(`${e.target.value} theme applied sucessfully`, {
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

  const onChangefunc = (value) => {
    onCodeChange(value);
    setCode(value);

    socketRef.current?.emit('codeChange', {
      roomId,
      code: value
    });
  };

  useEffect(() => {
    const settingCode = () => {
      socketRef.current?.on('codeChangeBackend', ({code}) => {
        console.log(code);
        if(code !== null){
          setCode(code);
        }
      });
    }

    settingCode();

    return () => {
      socketRef.current.off('codeChangeBackend');
    }
  }, [socketRef.current]);

  return(
    <div className='relative'>
       <select onChange={handleThemeChange} className='absolute top-1 right-1 z-10 w-32 h-10 py-1 px-2 rounded-sm outline-none bg-gray-900 text-gray-200'>
        <option value="Themes" disabled selected>Themes</option>
          {themeOptions.map((themeCurr) => (
            <option key={themeCurr} value={themeCurr}>
              {themeCurr}
            </option>
          ))}
        </select>
      {
        theme === 'Darcula' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={darcula} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'Dracula' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={dracula} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'Sublime' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={sublime} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'Aura' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={aura} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'Duotone Dark' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={duotoneDark} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'Duotone Light' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={duotoneLight} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'Eclipse' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={eclipse} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'Github Light' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={githubLight} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'Github Dark' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={githubDark} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'NoctisLilac' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={noctisLilac} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'Nord' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={nord} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'Okaidia' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={okaidia} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'TokyoNight' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={tokyoNight} extensions={[javascript({ jsx: true }), cpp()]}/>)  ||
        theme === 'VscodeDark' && (<CodeMirror value={code} onChange={onChangefunc} height="100vh" theme={vscodeDark} extensions={[javascript({ jsx: true }), cpp()]}/>)
      }

      <ToastContainer />
    </div>
  )
}

export default Editor
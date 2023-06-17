import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import {dracula} from '@uiw/codemirror-theme-dracula'
import { socketInit } from '../socket';

function Editor({socketRef, roomId, onCodeChange}) {
  const [code, setCode] = useState("// Welcome to \"Code Share - Realtime Code Sharing Editor\"\n// Happy Coding..!!");

  const editorRef = useRef(null);

  const handleChange = async (val) => {
    await setCode(val);
  }

  const onChange = useCallback((value, viewUpdate) => {
    onCodeChange(value);
    setCode(value);
  }, []);

  useEffect(() => {
    editorRef.current = code;
    socketRef.current?.emit('codeChange', {
      roomId,
      code
    });
  }, [code]);

  useEffect(() => {
    socketRef.current?.on('codeChangeBackend', ({code}) => {
      if(code !== null){
        setCode(code);
      }
    });

    return () => {
      socketRef.current?.off('codeChangeBackend');
    };
  }, [socketRef.current]);

  return(
    <div>
      <CodeMirror
        value={code}
        onChange={onChange}
        height="100vh"
        theme={dracula} 
        extensions={[javascript({ jsx: true }), cpp()]}
      />
    </div>
  )
}

export default Editor
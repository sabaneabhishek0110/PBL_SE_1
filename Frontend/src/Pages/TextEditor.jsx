// import React ,{useState,useEffect, useCallback}from "react"
// import { useParams } from "react-router-dom";
// import Quill from 'quill';
// import {io} from 'socket.io-client';
// import {LockKeyhole,FileText,History} from 'lucide-react'
// import "quill/dist/quill.snow.css"; 
// import '../CSS/TextEditor.css'
// import ShareDrawer from "../Components/ShareDrawer";

// function TextEditor (){
//     const {id:documentId} = useParams();
//     const {access:accessType} = useParams();
//     const [socket,setSocket] = useState(null);
//     const [quill,setQuill] = useState(null);
//     const [title,setTitle] = useState("Untitled Document");
//     const [isEditingTitle,setIsEditingTitle] = useState(false);
//     const [showShareDrawer,setShowShareDrawer] = useState(false);

//     const SAVE_INTERVAL_MS = 2000;

//     const TOOLBAR_OPTIONS = [
//         [{header : [1,2,3,4,5,6,false]}],
//         [{font : []}],
//         [{list : "ordered"},{list : "bullet"}],
//         ["bold","italic","underline"],
//         [{color : []},{background : []}],
//         [{script : "sub"},{script : "super"}],
//         [{align : []}],
//         ["image","blockquote","code-block"],
//         ["clean"],
//     ]

//     const handleBlur = () => {
//         console.log("dhksjhjkdh");
//         if (title.trim() === "") {
//             setTitle("Untitled Document");
//         }
//         setIsEditingTitle(false);
//     };

//     useEffect(()=>{
//         const s = io("http://localhost:5000",{
//             transports: ["websocket", "polling"],
//         });

//         setSocket(s);
//         return ()=>{
//             s.disconnect();
//         }
//     },[])

//     useEffect(()=>{
//         if(!socket || !quill) return;
//         console.log("gsjkahsaks",documentId);
//         socket.emit('get-document',documentId);
        
//         socket.once('load-content',(document)=>{
//             if (!document) {
//                 console.error("Document not found");
//                 return;
//             }

//             setTitle(document.title || "Untitled Document");
//             quill.setContents(document.content);
//             if(accessType==="Editor" || accessType==="owner"){
//                 quill.disable();
//             }
//             else{
//                 quill.enable();
//             }
//         })
//     },[socket,quill,documentId]);

//     useEffect(()=>{
//         if(!socket || !quill) return;

//         const handler = (data,oldData,source) =>{
//             if(source !== "user") return;
//             socket.emit('send-changes',data);
//         }
//         quill.on('text-change',handler);

//         return () =>{
//             quill.off('text-change',handler)
//         }
//     },[socket,quill]);

//     useEffect(()=>{
//         if(!socket || !quill) return;
        
//         const handler = (data) =>{
//             quill.updateContents(data);
//         }
//         socket.on('receive-changes',handler);

//         return () =>{
//             socket.off('receive-changes',handler)
//         }
//     },[socket,quill,title]);

//     useEffect(()=>{
//         if(!socket || !quill) return;

//         const interval = setInterval(()=>{
//             socket.emit('save-document',quill.getContents());
//             socket.emit('save-title',title);
//         },SAVE_INTERVAL_MS);

//         return ()=>{
//             clearInterval(interval);
//         }
//     },[socket,quill,title]);

//     const wrapperRef = useCallback((wrapper)=>{
//         if(!wrapper) return;

//         if (wrapper.querySelector(".ql-container")) return;

//         wrapper.innerHTML="";  
//         const editor = document.createElement('div');

//         wrapper.append(editor);

//         const q = new Quill(editor,{
//             theme : 'snow',
//             modules : {toolbar : TOOLBAR_OPTIONS},
//         })
        
//         q.disable();
//         q.setText("Loading...");
//         setQuill(q);
//     },[]);

//     return(

//         <div>
//             <div className="toolbar flex flex-row justify-between px-10 my-3 items-center">
//                 <div className="flex flex-row items-center space-x-2">
//                     <FileText size={24} className="text-blue-200"/>
//                     {isEditingTitle ? (
//                         <input 
//                             className="title-input text-white"
//                             value={title}
//                             onChange={(e)=>{setTitle(e.target.value)}}
//                             onBlur={handleBlur}
//                             onKeyDown={(e)=>{e.key==="Enter" && handleBlur}}
//                             autoFocus
//                         />
//                         ) : (
//                         <h1 className="title text-white text-xl" onClick={()=>{setIsEditingTitle(true)}}>{title}</h1>
//                         )
//                     }
//                 </div>
//                 <div className="space-x-6 flex flex-row items-center">
                        
//                     <button className="cursor-pointer">
//                         <History className="w-7 h-7 text-gray-200"/>
//                     </button>
//                     <button className="bg-blue-200 px-4 py-2 rounded-full flex flex-row space-x-2 items-center cursor-pointer" onClick={()=>{setShowShareDrawer(true)}}><LockKeyhole className="w-5 h-5"/><h1>Share</h1></button>
//                 </div>
//             </div>
//             <div className="container" ref={wrapperRef}></div>

//             {showShareDrawer && 
//                 (<div className='fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 backdrop-blur-md  '>
//                     <ShareDrawer id={documentId} title={title} onClose={()=>{setShowShareDrawer(false)}}/>
//                 </div> )   
//             }
//         </div>
//     )
// }

// export default TextEditor;





import React, { useState, useEffect, useCallback ,useRef} from "react";
import { useParams } from "react-router-dom";
import Quill from "quill";
const Delta = Quill.import('delta');
import { io } from "socket.io-client";
import { LockKeyhole, FileText, History,X } from "lucide-react";
import "quill/dist/quill.snow.css";
import "../CSS/TextEditor.css";
import ShareDrawer from "../Components/ShareDrawer";
import { version } from "mongoose";
import TeamSelector from "../Components/TeamSelector";

function TextEditor() {
    const { id: documentId } = useParams();
    const {accessType } = useParams();
    const [socket, setSocket] = useState(null);
    const [quill, setQuill] = useState(null);
    const [title, setTitle] = useState("Untitled Document");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [showShareDrawer, setShowShareDrawer] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [date,setDate] = useState(null);
    const [versions, setVersions] = useState([]); // Store past versions
    const [lastSavedContent, setLastSavedContent] = useState(new Delta()); // To compare content changes
    const [team,setTeam] = useState(null);
    const [userTeams,setuserTeams] = useState(null);
    const prevTitleRef = useRef(title);
    const [isSavingTitle, setIsSavingTitle] = useState(false);
    let firstSaveDone = useRef(false);

    const lastSavedTitleRef = useRef(title);
    const SAVE_INTERVAL_MS = 5000;
    const DEBOUNCE_DELAY_MS = 2000;

    const TOOLBAR_OPTIONS = [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ align: [] }],
        ["image", "blockquote", "code-block"],
        ["clean"],
    ];

    // Calculate Levenshtein Distance
    // const levenshteinDistance = (str1, str2) => {
    //     // Ensure we're comparing strings
    //     const s1 = typeof str1 === 'string' ? str1 : JSON.stringify(str1);
    //     const s2 = typeof str2 === 'string' ? str2 : JSON.stringify(str2);
    
    //     if (!s1 || !s2) return Math.max(s1?.length || 0, s2?.length || 0);
    
    //     // Initialize matrix properly
    //     const matrix = Array.from({ length: s1.length + 1 }, () => 
    //         Array(s2.length + 1).fill(0)
    //     );
    
    //     for (let i = 0; i <= s1.length; i++) matrix[i][0] = i;
    //     for (let j = 0; j <= s2.length; j++) matrix[0][j] = j;
    
    //     for (let i = 1; i <= s1.length; i++) {
    //         for (let j = 1; j <= s2.length; j++) {
    //             const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
    //             matrix[i][j] = Math.min(
    //                 matrix[i - 1][j] + 1,
    //                 matrix[i][j - 1] + 1,
    //                 matrix[i - 1][j - 1] + cost
    //             );
    //         }
    //     }
    
    //     return matrix[s1.length][s2.length];
    // };

    const hasSignificantChanges = (oldDelta, newDelta) => {
        const diff = new Delta(oldDelta).diff(newDelta);
        return diff.ops.length > 3;
    };
    
    const areDeltasEqual = (delta1, delta2) => {
        return JSON.stringify(delta1) === JSON.stringify(delta2);
    };
    const debounce = (func, delay) => {
        let timeout;
        const wrapped = (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
        wrapped.cancel = () => clearTimeout(timeout);
        return wrapped;
    };
    
    useEffect(() => {
        const s = io("http://localhost:5000", {
            transports: ["websocket", "polling"],
        });

        setSocket(s);
        return () => {
            s.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket || !quill) return;
        socket.emit("get-document", documentId);

        socket.once("load-content", (document) => {
            if (!document) {
                console.error("Document not found");
                return;
            }

            setTitle(document.title || "Untitled Document");
            quill.setContents(document.content);
            setLastSavedContent(document.content);
            setVersions(document.versions || []);
            if (accessType === "Editor" || accessType === "owner") {
                quill.enable();
            } else {
                quill.disable();
            }
        });
    }, [socket, quill, documentId]);


    useEffect(() => {
        if (!socket || !quill) return;
        
        const handler = debounce(() => {
            if (title !== prevTitleRef.current) {
                setIsSavingTitle(true);
                socket.emit("save-title", { documentId, title }, () => {
                    setIsSavingTitle(false);
                    prevTitleRef.current = title;
                });
            }
        }, 1000);
        
        handler();
        return () => handler.cancel();
    }, [title, documentId]);

    // useEffect(() => {
    //     if (!socket || !quill) return;

    //     const handler = (data, oldData, source) => {
    //         if (source !== "user") return;
    //         socket.emit("send-changes", data);
    //     };
    //     quill.on("text-change", handler);

    //     return () => {
    //         quill.off("text-change", handler);
    //     };
    // }, [socket, quill]);

    // useEffect(() => {
    //     if (!socket || !quill) return;

    //     const handler = (data) => {
    //         quill.updateContents(data);
    //     };
    //     socket.on("receive-changes", handler);

    //     return () => {
    //         socket.off("receive-changes", handler);
    //     };
    // }, [socket, quill]);


    // useEffect(() => {
    //     if (!socket || !quill) return;

    //     const interval = setInterval(() => {
    //         const currentContent = quill.getContents();
    //         const currentText = quill.getText();

    //         const lastSavedText = JSON.stringify(lastSavedContent);
    //         const currentTextStr = JSON.stringify(currentContent);
    //         const difference = levenshteinDistance(lastSavedText, currentTextStr);


    //         const threshold = Math.max(10, currentText.length * 0.05);
            
    //         if ((difference > threshold ) && !areDeltasEqual(currentContent, lastSavedContent)) {
    //             const token = localStorage.getItem('token');
    //             socket.emit("save-version", { documentId, content: currentContent, title, token });
    //             setLastSavedContent(currentContent);
    //             firstSaveDone = true;
    //         } else {
    //             socket.emit("save-document", { documentId, content: currentContent });
    //         }
    //     }, SAVE_INTERVAL_MS);

    
    //     return () => clearInterval(interval);
    // }, [socket, quill, title,lastSavedContent]);


    useEffect(() => {
        if (!socket || !quill) return;

        const saveHandler = () => {
            
            const currentContent = quill.getContents();
            const contentChanged = !areDeltasEqual(currentContent, lastSavedContent);
            const titleChanged = title !== lastSavedTitleRef.current;

            if(contentChanged || titleChanged){
                if (contentChanged && hasSignificantChanges(lastSavedContent, currentContent)) {
                    const token = localStorage.getItem('token');
                    socket.emit("save-version", { 
                        documentId, 
                        content: currentContent, 
                        title, 
                        token 
                    });
                } else{
                    socket.emit("save-document", { 
                        documentId, 
                        content: currentContent ,
                        title : title
                    });
                }
                setLastSavedContent(currentContent);
                lastSavedTitleRef.current = title;
            }
            
        };

        const debouncedSave = debounce(saveHandler, DEBOUNCE_DELAY_MS);
        const textChangeHandler = () => debouncedSave();

        quill.on('text-change', textChangeHandler);

        return () => {
            quill.off('text-change', textChangeHandler);
            debouncedSave.cancel();
        };
    }, [socket, quill, title,lastSavedContent]);

    useEffect(() => {
        if (!socket || !quill) return;
        
        const titleChangeHandler = debounce(() => {
            if (title !== lastSavedTitleRef.current) {
                socket.emit("save-document", { 
                    documentId, 
                    content: quill.getContents(),
                    title 
                });
                lastSavedTitleRef.current = title;
            }
        }, DEBOUNCE_DELAY_MS);
    
        return () => titleChangeHandler.cancel();
    }, [socket, title]);

    
    const restoreVersion = (version) => {
        quill.setContents(version.content);
        setTitle(version.title);
        setLastSavedContent(version.content);
    };

    const wrapperRef = useCallback((wrapper) => {
        if (!wrapper) return;
        if (wrapper.querySelector(".ql-container")) return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);

        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS },
        });

        q.disable();
        q.setText("Loading...");
        setQuill(q);
    }, []);

    const fetchDocumentTeam = async () =>{
        try{
            const response = await fetch(`http://localhost:5000/api/yourDocuments/getDocumentTeam/${id}`,{
                method : "GET",
                headers : {
                  "Content-Type" : "application/json",
                  "Authorization" : `Bearer ${token}`
                }
              })
              if(!response.ok){
                console.log("failed to get document team");
                return;
              }
              const data = await response.json();
              setTeam(data.team);
              console.log("document team fetched successfully");
        }
        catch(error){
            console.log("failed to fetch doucment team",error);
        }
    }

    const fetchUserTeams = async () =>{
        try{
            const response = await fetch(`http://localhost:5000/api/yourDocuments/getUserTeams`,{
                method : "GET",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${token}`
                }
                })
                if(!response.ok){
                console.log("failed to get user teams");
                return;
                }
                const data = await response.json();
                setuserTeams(data.team);
                console.log("user teams fetched successfully");
        }
        catch(error){
            console.log("failed to fetch user teams",error);
        }
    }

    return (
        <div>
            <div className="toolbar flex flex-row justify-between px-8 py-2 m-1 top-0 z-10 items-center text-black">
                <div className="flex flex-row items-center space-x-2">
                    <FileText size={30} className="text-blue-400" />
                    {isEditingTitle ? (
                        <input
                            className="title-input text-white bg-transparent w-80 border-none outline-none text-xl px-3 py-1 "
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => setIsEditingTitle(false)}
                            autoFocus
                        />
                    ) : (
                        <h1 className="title text-white text-xl m-0 cursor-pointer max-w-80 overflow-hidden" onClick={() => setIsEditingTitle(true)}>
                            {title}
                        </h1>
                    )}
                </div>
                <div className="space-x-6 flex flex-row items-center">
                    <button className="cursor-pointer" onClick={() => setShowHistory(!showHistory)}>
                        <History className="w-7 h-7 text-gray-200" />
                    </button>
                    <button
                        className="bg-blue-200 px-4 py-2 rounded-full flex flex-row space-x-2 items-center cursor-pointer"
                        onClick={() => setShowShareDrawer(true)}
                    >
                        <LockKeyhole className="w-5 h-5" />
                        <h1>Share</h1>
                    </button>
                </div>
            </div>
            
            <div className="container w-[90%] h-[100vh-80px] mx-auto max-w-[1200px]" ref={wrapperRef}></div>
            {showShareDrawer && 
                (<div className='fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 backdrop-blur-md  '>
                    <ShareDrawer id={documentId} title={title} accessType={accessType} onClose={()=>{setShowShareDrawer(false)}}/>
                </div> )   
            }

            {showHistory && (
                <div className="history-bar">
                    <div className="history-header">
                        <h2>Version History</h2>
                        <button onClick={() => setShowHistory(false)}>
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                    <ul className="history-list">
                    {versions.map((version, index) => {
                        const date = new Date(version.timestamp);
                        const formattedDate = date.toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        });

                        return (
                        <li
                            key={index}
                            className="history-item"
                            onClick={() => restoreVersion(version)}
                        >
                            <li>{formattedDate}</li> 
                            <li>{version.updated_by.name}</li>
                        </li>
                        );
                    })}
                    </ul>

                </div>
            )}
        </div>
    );
}

export default TextEditor;






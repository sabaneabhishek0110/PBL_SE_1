import React,{useState,useEffect} from 'react'
import {FileText,FilePlus ,MoreVertical} from 'lucide-react';
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import TeamSelector from '../Components/TeamSelector';

function Your_Documents() {
    const [documents,setDocuments] = useState([]);
    const [isOpen,setIsOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [team,setTeam] = useState(null);
    const [userTeams,setuserTeams] = useState([]);
    const navigate = useNavigate();

    const fetchDocuments = async() =>{
        try{
            console.log("entered in fetchDocuments in Your_Documents.jsx");
            const token = localStorage.getItem('token');

            const response = await fetch("http://localhost:5000/api/yourDocuments/getUserDocuments",{
                method : 'GET',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                }
            })

            if(!response.ok){
                console.log("failed to fetch user Documents");
                return ;
            }

            const data = await response.json();
            console.log("fetched documents : ",data);
            setDocuments(data.documents);
            console.log("completed fetchDocuments successfully in Your_Documents.jsx");
        }
        catch(error){
            console.log("failed to fetch user Documents");
            console.log(error);
        }
    }

    const createDocument = async() =>{
        try{
            console.log("entered in createDocument in Your_Documents.jsx");
            const token = localStorage.getItem('token');

            const response = await fetch("http://localhost:5000/api/yourDocuments/createDocument",{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body : JSON.stringify({team : team._id})
            })

            if(!response.ok){
                console.log("failed to create Document");
                return ;
            }
            const data = await response.json();
            navigate(`/textEditor/${data.documentId}/owner`);
            
            console.log("completed createDocument successfully in Your_Documents.jsx");
        }
        catch(error){
            console.log("failed to create Document");
            console.log(error);
        }
    }

    // Delete document
    const removeDocument = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/yourDocuments/removeDocument/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to remove document");
        console.log("document removed successfully ");
        fetchAccessedMembers(); // Refresh list
      } catch (error) {
        console.log("Error revoking access:", error);
      }
    };

    const showDocument = async(id) =>{
      try{
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/yourDocuments/getUserAccess/${id}`,{
          method : "GET",
          headers : {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
          }
        })
        if(!response.ok){
          console.log("failed to get accessType of user");
          return;
        }
        const data = await response.json();
        const accessType = data.accessType;
        navigate(`/textEditor/${id}/${accessType}`);
        console.log("documed shown successfully");
      }
      catch(error){
        console.log("failed to show document");
        console.log(error);
        return;
      }
    }

    const fetchUserTeams = async () =>{
      try{
          console.log("khdkjfhjdh")
          const token = localStorage.getItem("token");
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
            console.log("dkjhsh",data);
            setuserTeams(data);
            console.log("user teams fetched successfully");
      }
      catch(error){
          console.log("failed to fetch user teams",error);
      }
    }

    useEffect(()=>{
        fetchDocuments();
        fetchUserTeams();
    },[isOpen]);
  return (

    // <motion.div
    //   className="text-white flex flex-col items-center h-screen w-full bg-gray-900 p-4"
    //   initial={{ opacity: 0, y: -20 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   transition={{ duration: 0.4 }}
    // >
    //   {/* Header Section */}
    //   <div className='rounded-lg bg-gray-900 w-full h-full mb-1 flex flex-col shadow-xl p-2'>
    //     <div className="flex justify-between items-center mb-6">
    //       <h2 className="text-3xl font-bold">Your Documents</h2>
    //       <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition" onClick={createDocument}>
    //         <FilePlus size={20} />
    //         <span>Create New</span>
    //       </button>
    //     </div>

    //     <hr className="border-gray-700 mb-6" />

    //     {/* Documents List */}
    //     {documents?.length > 0 ? (
    //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    //         {documents.map((document, index) => (
    //           <div
    //           onClick={() =>{showDocument(document._id)}}
    //           key={index}
    //             className="flex flex-row justify-between items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition cursor-pointer shadow-lg"
    //           >
    //             <div className='flex flex-row space-x-2 items-center'>
    //               <FileText size={24} className="text-gray-400" />
    //               <p className="truncate w-full text-lg">{document.title}</p>
    //             </div>
    //             <button className='cursor-pointer hover:bg-gray-800 p-1 border-1 border-transparent rounded-full' onClick={(event) => {
    //               event.stopPropagation(); // Prevents opening the document
    //               setOpenMenuId((prevId) => (prevId === document._id ? null : document._id));
    //             }}>
    //               <MoreVertical className='w-5 h-5'/>
    //               {openMenuId === document._id && (
    //                 <div
    //                   className="absolute mt-2 w-40 bg-gray-800 rounded-lg shadow-lg"
    //                   onClick={(e) => e.stopPropagation()} // Prevents closing on click inside
    //                 >
    //                   <button
    //                     className="w-full text-left px-4 py-2 cursor-pointer"
    //                     onClick={(e) => {
    //                       e.stopPropagation(); // Prevents opening the document
    //                       removeDocument(document._id);
    //                       setOpenMenuId(null);
    //                     }}
    //                   >
    //                     Delete
    //                   </button>
    //                 </div>
    //               )}
    //             </button>
    //           </div>
    //         ))}
    //       </div>
    //     ) : (
    //       // Empty State (No Documents)
    //       <div className="flex flex-col items-center justify-center h-64 text-gray-400">
    //         <FileText size={50} className="mb-4" />
    //         <p className="text-lg">No Documents Available</p>
    //       </div>
    //     )}
    //   </div>
    // </motion.div>

    <motion.div
      className=" flex flex-col items-center h-screen w-full bg-gray-900 p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Section */}
      <div className="rounded-lg bg-gray-900 w-full h-full mb-1 flex flex-col shadow-xl p-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-3xl font-bold">Your Documents</h2>
          <button
            className=" flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            onClick={()=>{
              console.log(userTeams);
              if(userTeams.length===0){
                toast.error("You should join atleast one team to create your document");
                return;
              }
              setIsOpen(true);
            }
            }
          >
            <FilePlus size={20} />
            <span className='text-white'>Create New</span>
          </button>

          {isOpen && (
            <TeamSelector className="fixed inset-0 bg-black/80 bg-opacity-10 flex justify-center items-center z-50" teams={userTeams} team={team} setTeam={setTeam} onDone={()=>{
              if (!team) {
                toast.error("Please select a team");
                return;
              }
              setTeam(team);
              setIsOpen(false);
              createDocument();
            }}/>
          )}
        </div>

        <hr className="border-gray-700 mb-6" />

        {/* Documents List */}
        {documents?.length > 0 ? (
          <div className="text-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((document) => (
              <div
                key={document._id}
                onClick={() => showDocument(document._id)}
                className="relative flex flex-row justify-between items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition cursor-pointer shadow-lg"
              >
                <div className="flex flex-row space-x-2 items-center">
                  <FileText size={24} className="text-gray-400" />
                  <p className="truncate w-full text-lg">{document.title}</p>
                </div>

                {/* More Options Button */}
                <div className="relative">
                  <button
                    className="cursor-pointer hover:bg-gray-800 p-1 border border-transparent rounded-full"
                    onClick={(event) => {
                      event.stopPropagation(); // Prevents opening the document
                      setOpenMenuId((prevId) => (prevId === document._id ? null : document._id));
                    }}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === document._id && (
                    <div
                      className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-50"
                      onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
                    >
                      <button
                        className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-700 transition"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents opening the document
                          removeDocument(document._id);
                          setOpenMenuId(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State (No Documents)
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FileText size={50} className="mb-4" />
            <p className="text-lg">No Documents Available</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Your_Documents
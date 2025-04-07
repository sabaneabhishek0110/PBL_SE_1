import React,{useState,useEffect} from 'react';
import Delete from '../Components/Delete';
import { Paperclip, RefreshCcw,X,MoreVertical } from 'lucide-react';
import UploadWindow from '../Components/upLoadWindow';

function TaskDrawer({ selectedTask , selectedTeam,onClose}) {
  if (!selectedTask) return null; // Prevent errors if no task is selected
  console.log("djkdhjk : ",selectedTask);
  const [isOpen , setIsOpen]=useState(false);
  const [showUploadWindow, setShowUploadWindow] = useState(false);
  const [teamDocuments, setTeamDocuments] = useState([]);

  const fetchUserDocOfTeam = async () =>{
    try{
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/yourDocuments/getUserDocumentRelatedToTeam/${selectedTeam}`,{
        method : "GET",
        headers : {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`
        }
      })
      if(!response.ok){
        console.log("failed to fetch user documents related to team");
        return;
      }
      const data = await response.json();
      // console.log(data);
      setTeamDocuments(data.documents);
      console.log("User documents related to team fetched successfully");
    }
    catch(error){
      console.log("failed to fetch document of user related to team",error);
    }
  }

  const handleUploadComplete = (file) => {
    // Handle the uploaded file
    console.log('Uploaded file:', file);
  };

  const handleTeamDocSelect = (document) => {
    // Handle selected team document
    console.log('Selected team document:', document);
  };

  const deleteTask = async() =>{
    try{
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/tasks/deleteTask",{
        method : "PUT",
        headers : {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`,
        },
        body : JSON.stringify({task : selectedTask}) 
      })

      if(!response.ok){
        console.log("failed to delete task");
        return ;
      }
      toast.success("task deleted successfully");
      onClose();
    }
    catch(error){
      console.log("failed to delete task");
      console.log(error);
    }
  }
  useEffect(()=>{
    fetchUserDocOfTeam();
  },[]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-md shadow-lg w-[80%] relative">
      
      <button className='absolute right-1 top-1 text-gray-400' onClick={onClose}>
        <X size={20} />
      </button>

      
      <div className='flex flex-row items-start justify-between'>
        <div>
          <h2 className="text-xl font-semibold">{selectedTask?.title}</h2>
          <p className="text-gray-400">{selectedTask?.description}</p>
        </div>

        <div className='relative mt-1'>
          <MoreVertical size={20} className='cursor-pointer text-white hover:text-gray-600'
            onClick={() => setIsOpen(true)}
            />

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg">
              {/* <Delete 
                onClick={() => setIsOpen(false) }
              /> */}
              <button className="w-full text-left px-4 py-2 cursor-pointer" onClick={() => setIsOpen(false) }>
                  Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stages Section */}
      <div className="mt-4">
        <p className="font-semibold text-gray-300 mb-4">Stages:</p>
        <div className="space-y-3">
          {selectedTask?.stages?.length > 0 ? (  selectedTask?.stages?.map((stage, index) => (

            <div key={index} className="bg-gray-800 p-4 rounded-md shadow-md">
              {/* Stage Title & Actions */}
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium text-white">{stage?.title}</p>

                {/* Attachment & Update Buttons (Shown for Ongoing Tasks) */}
                {selectedTask?.status === "ongoing" && (
                  <div className="flex items-center space-x-3">
                    {/* Attachment Icon */}
                    <button onClick={() => setShowUploadWindow(true)}>
                      <Paperclip size={20} className="text-gray-400 cursor-pointer hover:text-white transition-colors"/>
                    </button >

                    {/* Update Button */}
                    <button className="px-3 py-1 bg-blue-500 rounded-md text-white hover:bg-blue-600 flex items-center space-x-2 transition">
                      <RefreshCcw size={18} />
                      <span>Update</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Assigned Members */}
              <div className="flex mt-2">
                {stage?.members.slice(0,1).map((member, key) => (
                      <img
                        key={key}
                        src={member?.profilePicture} // Fallback if no image
                        alt={member?.name || "Unknown"}
                        title={member?.name || "No Name"}
                        className={`w-10 h-10 rounded-full object-cover border-2 border-gray-600 ${
                          index === 0 ? "ml-0" : "-ml-4"
                        }`}
                      />
                ))}
                {stage.members.length > 1 && (
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-700 text-white text-sm font-medium rounded-full border-2 border-gray-600 -ml-3">
                      +{stage.members.length - 1}
                  </div>
                )}
              </div>

            </div>

          ))): (
            <p className="text-gray-500">No stages available.</p>
          )}
        </div>
      </div>
      {showUploadWindow && (
        <UploadWindow
          onClose={() => setShowUploadWindow(false)}
          teamDocuments={teamDocuments}
          onFileSelected={handleUploadComplete}
          onSelectTeamDocument={handleTeamDocSelect}
        />
      )}
    </div>
  );
}

export default TaskDrawer;
    
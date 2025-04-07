import React, { useState, useEffect } from "react";
import Select from "react-select";

function ShareDrawer({ title, id,accessType, onClose }) {
  const [allMembers, setAllMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [accessType1, setAccessType1] = useState("Viewer");
  const [accessedMembers, setAccessedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [owner,setOwner] = useState({});

  // Fetch all users
  const fetchTeamMembers = async () => {
    try {
      // fetchAccessedMembers();
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/yourDocuments/getTeamMembers/${id}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token}` 
        }
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setAllMembers(data.map((user) => ({ value: user._id, label: user.name })));
    } catch (error) {
      console.log("Error fetching users:", error);
      setAllMembers([]);
    }
  };

  // Fetch members who already have access
  const fetchAccessedMembers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/yourDocuments/getAccessedMembers/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch accessed members");
      const data = await response.json();
      console.log(data)
      setAccessedMembers(data.accessedMembers);
    } catch (error) {
      console.log("Error fetching accessed members:", error);
    }
  };

  // Give access to selected members
  const giveAccess = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/yourDocuments/giveAccess/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          selectedMembers: selectedMembers.map((m) => m.value),
          accessType: accessType1,
        }),
      });
      if (!response.ok) throw new Error("Failed to give access");
      console.log("Access granted successfully");
      fetchAccessedMembers(); // Refresh list
    } catch (error) {
      console.log("Error giving access:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update access type of a member
  const updateAccess = async (memberId, newAccessType) => {
    try {
      const response = await fetch(`http://localhost:5000/api/yourDocuments/updateAccess/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ member: memberId, accessType: newAccessType }),
      });
      if (!response.ok) throw new Error("Failed to update access");
      console.log("Access updated successfully");
      fetchAccessedMembers(); // Refresh list
    } catch (error) {
      console.log("Error updating access:", error);
    }
  };

  // Revoke access from a member
  const revokeAccess = async (memberId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/yourDocuments/revokeAccess/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ member: memberId }),
      });
      if (!response.ok) throw new Error("Failed to revoke access");
      console.log("Access revoked successfully");
      fetchAccessedMembers(); // Refresh list
    } catch (error) {
      console.log("Error revoking access:", error);
    }
  };

  const getOwner = async() =>{
    try{
      const response = await fetch(`http://localhost:5000/api/yourDocuments/getOwner/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      if (!response.ok) throw new Error("Failed to fetch owner of document");
      const data = await response.json();
      console.log("Owner fetched:", data.owner);
      setOwner(data.owner);
      console.log("owner of the document fetched successfully");
    }
    catch(error){
      console.log("failed to get owner of the document",error);
    }
  }


  useEffect(() => {
    fetchTeamMembers();
    fetchAccessedMembers();
    getOwner();
  }, [id]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 text-black">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-semibold text-black">{title}</h2>
        {console.log("jldhjsdkl",accessType)}
        {accessType==="owner" && (
          <div>
            <div className="mt-4">
              <Select
                isMulti
                options={allMembers}
                value={selectedMembers}
                onChange={setSelectedMembers}
                className="bg-black text-black rounded-md"
                placeholder="Select members..."
              />
            </div>

            <div className="mt-4 flex gap-6 items-center">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-blue-600">
                <input
                  type="radio"
                  name="accessType"
                  value="Viewer"
                  checked={accessType1 === "Viewer"}
                  onChange={() => setAccessType1("Viewer")}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center 
                  ${accessType1 === "Viewer" ? "border-blue-500" : ""}`}
                >
                  {accessType1 === "Viewer" && <span className="w-3 h-3 bg-blue-500 rounded-full"></span>}
                </span>
                Viewer
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-blue-600">
                <input
                  type="radio"
                  name="accessType"
                  value="Editor"
                  checked={accessType1 === "Editor"}
                  onChange={() => setAccessType1("Editor")}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center 
                  ${accessType1 === "Editor" ? "border-blue-500" : ""}`}
                >
                  {accessType1 === "Editor" && <span className="w-3 h-3 bg-blue-500 rounded-full"></span>}
                </span>
                Editor
              </label>
            </div>

            <button
              onClick={giveAccess}
              className="mt-4 bg-blue-600 text-black hover:bg-blue-800 px-4 py-2 rounded cursor-pointer"
              disabled={loading}
            >
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
         )} 

        {/* List of Accessed Members */}
        <h3 className="mt-6 font-semibold">People with access:</h3>
        <ul className="mt-2">
          {console.log("ihhkjlkj",owner.name)}
          <div className="flex justify-between items-center p-2 border-b">
            <span>{owner?.name || "Loading..."}</span>
            <p>Owner</p>
          </div>
          {accessType==="owner" && (
            accessedMembers.map((member) => (
              
              <li key={member.user._id} className="flex justify-between items-center p-2 border-b">
                <span>{member.user.name}</span>
                <div className="flex flex-row space-x-2">
                  <select
                    value={member.access}
                    onChange={(e) => updateAccess(member.user._id, e.target.value)}
                    className="px-1 py-1 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="Viewer">👀 Viewer</option>
                    <option value="Editor">✏️ Editor</option>
                  </select>
                  <button
                    onClick={() => revokeAccess(member.user._id)}
                    className="ml-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))
          )}

          {accessType!=="owner" && (
            accessedMembers.map((member) => (
              
              <li key={member.user._id} className="flex justify-between items-center p-2 border-b">
                <span>{member.user.name}</span>
                <p>
                  {member.access==="Viewer"?"👀 Viewer" : "✏️ Editor"}
                </p>
              </li>
            ))
          )}
        </ul>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="mt-4 bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-800 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>

  );
}

export default ShareDrawer;






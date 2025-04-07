// import React, { useState } from 'react';
// import { X, UploadCloud, Folder, Users, FileText } from 'lucide-react';

// const UploadWindow = ({ onClose, teamDocuments, onUpload, onSelectTeamDocument }) => {
//   const [activeTab, setActiveTab] = useState('device');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedTeamDoc, setSelectedTeamDoc] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

// //   const handleUpload = () => {
// //     if (activeTab === 'device' && selectedFile) {
// //       setIsUploading(true);
// //       // Simulate upload progress
// //       const interval = setInterval(() => {
// //         setUploadProgress(prev => {
// //           if (prev >= 100) {
// //             clearInterval(interval);
// //             setIsUploading(false);
// //             onUpload(selectedFile);
// //             onClose();
// //             return 100;
// //           }
// //           return prev + 10;
// //         });
// //       }, 300);
// //     } else if (activeTab === 'team' && selectedTeamDoc) {
// //       onSelectTeamDocument(selectedTeamDoc);
// //       onClose();
// //     }
// //   };

// const handleUpload = async () => {
//     if (activeTab === 'device' && selectedFile) {
//       setIsUploading(true);
      
//       try {
//         const formData = new FormData();
//         formData.append('file', selectedFile);
  
//         // Simulate progress (since fetch doesn't support progress events)
//         const simulateProgress = () => {
//           setUploadProgress(prev => {
//             const newProgress = prev + 10;
//             if (newProgress >= 100) {
//               return 100;
//             }
//             return newProgress;
//           });
//         };
  
//         const intervalId = setInterval(simulateProgress, 300);
  
//         const response = await fetch('http://localhost:5000/api/upload', {
//           method: 'POST',
//           body: formData,
//         });
  
//         clearInterval(intervalId); // Stop simulation
//         setUploadProgress(100); // Complete progress
  
//         if (!response.ok) {
//           throw new Error(`Upload failed: ${response.statusText}`);
//         }
  
//         // Success: Pass file to parent and close modal
//         onUpload(selectedFile);
//         onClose();
        
//       } catch (error) {
//         console.error('Upload error:', error);
//         alert('Upload failed. Please try again.');
//       } finally {
//         setIsUploading(false);
//       }
  
//     } 
//     // Handle "team document" selection
//     else if (activeTab === 'team' && selectedTeamDoc) {
//       onSelectTeamDocument(selectedTeamDoc);
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md">
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="text-xl font-semibold">Upload Document</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X size={24} />
//           </button>
//         </div>

//         <div className="p-4">
//           {/* Tab Navigation */}
//           <div className="flex border-b mb-4">
//             <button
//               className={`py-2 px-4 font-medium ${activeTab === 'device' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//               onClick={() => setActiveTab('device')}
//             >
//               <div className="flex items-center gap-2">
//                 <UploadCloud size={18} />
//                 Your Device
//               </div>
//             </button>
//             <button
//               className={`py-2 px-4 font-medium ${activeTab === 'team' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//               onClick={() => setActiveTab('team')}
//             >
//               <div className="flex items-center gap-2">
//                 <Users size={18} />
//                 Team Documents
//               </div>
//             </button>
//           </div>

//           {/* Tab Content */}
//           {activeTab === 'device' ? (
//             <div className="space-y-4">
//               <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
//                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                   <UploadCloud size={32} className="text-gray-400" />
//                   <p className="mb-2 text-sm text-gray-500">
//                     <span className="font-semibold">Click to upload</span> or drag and drop
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     PDF, DOCX, PPTX, XLSX (Max 10MB)
//                   </p>
//                 </div>
//                 <input 
//                   type="file" 
//                   className="hidden" 
//                   onChange={handleFileChange}
//                   accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
//                 />
//               </label>
//               {selectedFile && (
//                 <div className="flex items-center p-3 bg-gray-50 rounded-md">
//                   <FileText size={20} className="text-blue-500 mr-2" />
//                   <span className="truncate flex-1">{selectedFile.name}</span>
//                   <span className="text-sm text-gray-500">
//                     {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                   </span>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {console.log(teamDocuments.length)};
//               {teamDocuments.length > 0 ? (
//                 teamDocuments.map(doc => (
//                   <div 
//                     key={doc.id}
//                     className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedTeamDoc?.id === doc.id ? 'border-blue-500 bg-blue-50' : ''}`}
//                     onClick={() => setSelectedTeamDoc(doc)}
//                   >
//                     <div className="flex items-center">
//                       <FileText size={18} className="text-gray-500 mr-2" />
//                       <div className="flex-1 min-w-0">
//                         <p className="truncate font-medium text-gray-500">{doc.title}</p>
//                         <p className="text-xs text-gray-500">
//                           Updated {new Date(doc.updatedAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <Folder size={32} className="mx-auto mb-2" />
//                   <p>No team documents available</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Upload Progress */}
//           {isUploading && (
//             <div className="mt-4">
//               <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-blue-500 transition-all duration-300" 
//                   style={{ width: `${uploadProgress}%` }}
//                 ></div>
//               </div>
//               <p className="text-sm text-center mt-1 text-gray-600">
//                 Uploading... {uploadProgress}%
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-end p-4 border-t">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 mr-2 text-gray-700 bg-red-600 rounded-md hover:bg-gray-200"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleUpload}
//             disabled={(activeTab === 'device' && !selectedFile) || (activeTab === 'team' && !selectedTeamDoc) || isUploading}
//             className={`px-4 py-2 text-white rounded-md ${(activeTab === 'device' && !selectedFile) || (activeTab === 'team' && !selectedTeamDoc) || isUploading ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-700'}`}
//           >
//             {activeTab === 'device' ? 'Upload' : 'Select Document'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadWindow;




import React, { useState } from 'react';
import { X, UploadCloud, Folder, Users, FileText, Image as ImageIcon } from 'lucide-react';

const UploadWindow = ({ onClose, teamDocuments, onFilesSelected, onSelectTeamDocument }) => {
  const [activeTab, setActiveTab] = useState('device');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedTeamDoc, setSelectedTeamDoc] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleConfirmSelection = () => {
    if (activeTab === 'device' && selectedFiles.length > 0) {
      onFilesSelected(selectedFiles); // Pass array of files to parent
      onClose();
    } else if (activeTab === 'team' && selectedTeamDoc) {
      onSelectTeamDocument(selectedTeamDoc);
      onClose();
    }
  };

  // File type icon component
  const FileIcon = ({ file }) => {
    const extension = file.name.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
    
    return isImage ? (
      <ImageIcon size={20} className="text-blue-500 mr-2" />
    ) : (
      <FileText size={20} className="text-blue-500 mr-2" />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add Attachments</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {/* Tab Navigation */}
          <div className="flex border-b mb-4">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'device' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('device')}
            >
              <div className="flex items-center gap-2">
                <UploadCloud size={18} />
                Your Device
              </div>
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'team' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('team')}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                Team Documents
              </div>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'device' ? (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud size={32} className="text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Images, PDF, DOCX, PPTX, XLSX (Max 10MB each)
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  multiple
                />
              </label>

              {/* Selected files list */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                    <FileIcon file={file} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {teamDocuments.length > 0 ? (
                teamDocuments.map(doc => (
                  <div 
                    key={doc.id}
                    className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedTeamDoc?.id === doc.id ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => setSelectedTeamDoc(doc)}
                  >
                    <div className="flex items-center">
                      <FileText size={18} className="text-gray-500 mr-2" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-gray-500">{doc.title}</p>
                        <p className="text-xs text-gray-500">
                          Updated {new Date(doc.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Folder size={32} className="mx-auto mb-2" />
                  <p>No team documents available</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={(activeTab === 'device' && selectedFiles.length === 0) || (activeTab === 'team' && !selectedTeamDoc)}
            className={`px-4 py-2 text-white rounded-md ${
              (activeTab === 'device' && selectedFiles.length === 0) || (activeTab === 'team' && !selectedTeamDoc)
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {activeTab === 'device' ? 'Add Files' : 'Select Document'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadWindow;
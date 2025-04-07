const Document = require('../Models/Document');
const yourDocumentController = require('../Controllers/yourDocumentsController');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET ;

const socketRoutes = (socket) =>{
    console.log("User is connected using id : "+socket.id);

    // socket.on('get-document', async (documentId) =>{
    //     const document = await Document.findOne({_id : documentId});
    //     socket.join(documentId);
        
    //     socket.emit('load-content',document);

    //     socket.on('send-changes',(data)=>{
    //         socket.broadcast.to(documentId).emit('receive-changes',data);
    //     })

    //     socket.on('save-document',async (data)=>{
    //         // await Document.findByIdAndUpdate(documentId,{$set : {"content.text" : data}});
    //         const existDocument = await Document.findOne({_id : documentId});
    //         if(existDocument){
    //             existDocument.content = data;
    //             await existDocument.save();
    //         }
    //     })
    //     socket.on('save-title',async (title)=>{
    //         // await Document.findByIdAndUpdate(documentId,{title : title}); 
    //         const existDocument = await Document.findOne({_id : documentId});
    //         if(existDocument){
    //             existDocument.title = title;
    //             await existDocument.save();
    //         }
    //     })

    //     socket.on('save-version',yourDocumentController.saveVersion)
    // })

    socket.on('get-document', async (documentId) => {
        try {
            const document = await Document.findById(documentId)
            .populate({
              path: 'versions.updated_by',
              select: 'name email' 
            });
            console.log(document);
            if (!document) {
                socket.emit('document-not-found');
                return;
            }
    
            socket.join(documentId);
            socket.emit('load-content', document);
    
        } catch (error) {
            console.error("Error fetching document:", error);
            socket.emit('error', 'Failed to load document.');
        }
    });
    
    // Send changes to other users in the same document room
    socket.on('send-changes', (data) => {
        const { documentId, changes } = data;
        socket.broadcast.to(documentId).emit('receive-changes', changes);
    });
    
    // Save document content
    socket.on('save-document', async ({ documentId, content,title }) => {
        try {
            const updatedDoc = await Document.findByIdAndUpdate(
                documentId,
                { content,title},
                { new: true } // 👈 this returns the updated document
            );
            console.log(updatedDoc.content);
        } catch (error) {
            console.error("Error saving document:", error);
            socket.emit('error', 'Failed to save document.');
        }
    });
    
    // Save document title
    socket.on('save-title', async ({ documentId, title }) => {
        try {
            await Document.findByIdAndUpdate(documentId, { title: title });
        } catch (error) {
            console.error("Error saving title:", error);
            socket.emit('error', 'Failed to save title.');
        }
    });
    
    // Save a new version of the document
    socket.on('save-version', async ({ documentId, content,title,token }) => {
        try {
            console.log("kdhksjhdjshdjksk",content);
            const decoded = jwt.verify(token, JWT_SECRET); // Decode token to get userId
            const userId = decoded.userId;
            await yourDocumentController.saveVersion(documentId, content,title,userId,socket);
        } catch (error) {
            console.error("Error saving version:", error);
            socket.emit('error', 'Failed to save document version.');
        }
    });
    

    
    socket.on('disconnect',()=>{
        console.log("User Disconnected : "+socket.id);
    })
}

module.exports = socketRoutes;
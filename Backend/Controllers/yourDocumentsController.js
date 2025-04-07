const Document = require('../Models/Document');
const User = require('../Models/User');
const Team = require('../Models/Team');

exports.getUserDocuments = async (req,res) =>{
    try{
        const userId = req.user.userId;
        const documents = await Document.find({owner : userId})

        if(documents.length===0){
           return res.status(200).json({message : "No document is avilable or accessible"});
        }
        return res.status(200).json({message : "documents fetched successfully",documents});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "failed to fetch user documents",error});
    }
}

exports.createDocument = async (req,res) =>{
    try{
        const userId = req.user.userId;
        const {team} = req.body;
        const newDocument = new Document({
            title : "Untitled Document",
            owner : userId,
            content : "",
            team :  team
        })

        await newDocument.save();
        res.status(200).json({message : "documents fetched successfully", documentId : newDocument._id});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "failed to fetch user documents",error});
    }
}

exports.giveAccess = async (req,res) =>{
    try{
        const userId = req.user.userId;
        const {id} = req.params;
        const {selectedMembers,accessType} = req.body;

        if (!id || !Array.isArray(selectedMembers) || selectedMembers.length === 0) {
            return res.status(400).json({ message: "Document ID and an array of users are required" });
        }

        const document = await Document.findOne({_id : id});

        if(!document){
           return res.status(501).json({message : "No document is avilable of provided id"});
        }

        if(document.owner.toString()!==userId){
            return res.status(401).json({message : "You doesnt have authority to give access"});
        }

        const existingMembers = document.permissions.map((perm) =>perm.user.toString());

        const newMembers = selectedMembers.filter((member)=>!existingMembers.includes(member));

        if(newMembers.length===0){
            return res.status(400).json({ message: "All users already have permissions" });
        }

        newMembers.forEach((userId)=>{
            document.permissions.push({user : userId,access : accessType});
        })

        await document.save();
        
        return res.status(201).json({message : "access is give successfully to members"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "failed to give access to members ",error});
    }
}

exports.updateAccess = async (req,res) =>{
    try{
        const userId = req.user.userId;
        const {id} = req.params;
        const {member,accessType} = req.body;

        if (!id || !member) {
            return res.status(400).json({ message: "Document ID and an array of users are required" });
        }

        const document = await Document.findOne({_id : id});

        if(!document){
           return res.status(501).json({message : "No document is avilable of provided id"});
        }

        if(document.owner.toString()!==userId){
            return res.status(401).json({message : "You doesnt have authority to give access"});
        }

        const existMember = document.permissions.filter((perm)=>perm.user.toString()===member);

        if(existMember.length===0){
            return res.status(400).json({ message: "Member is not have any access of this this docuement" });
        }

        const permission = document.permissions.find((perm)=>(perm.user.toString()===member));

        permission.access = accessType;

        await document.save();
        
        return res.status(201).json({message : "access is give successfully to members"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "failed to update access of member ",error});
    }
}

exports.getAccessedMembers = async (req,res) =>{
    try{
        const {id} = req.params;

        const document = await Document.findOne({_id : id}).populate("permissions.user", "name email");;

        if(!document){
           return res.status(404).json({message : "No document is avilable of provided id"});
        }

        const accessedMembers = [];

        document.permissions.map((perm)=>accessedMembers.push(perm));


        return res.status(200).json({message : "members having access to document is fetched successfully",accessedMembers});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "failed to get members having access to document ",error});
    }
}

exports.revokeAccess = async (req,res) =>{
    try{
        const userId = req.user.userId;
        console.log("skdsjkhdshd",req.body);
        const {id} = req.params;
        const {member} = req.body;

        if (!id || !member) {
            return res.status(400).json({ message: "Document ID and an array of users are required" });
        }

        const document = await Document.findOne({_id : id});

        if(!document){
           return res.status(501).json({message : "No document is avilable of provided id"});
        }

        if(document.owner.toString()!==userId){
            return res.status(401).json({message : "You doesnt have authority to revoke access"});
        }

        const permissionIndex = document.permissions.findIndex((perm)=>perm.user.toString()===member);

        if(permissionIndex===-1){
            return res.status(400).json({ message: "Member is not have any access of this this document" });
        }

        document.permissions.splice(permissionIndex,1);

        await document.save();
        
        return res.status(201).json({message : "access of member is revoked successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "failed to revoke access of member ",error});
    }
}

// exports.getTeamMembers = async (req,res) => {
//     try{
//         console.log("Entered into yourDocumentsController.js")
//         console.log("Entered into getTeamMembers in yourDocuments.js");
//         const userId = req.user.userId;
//         const {id} = req.params;

//         const document = await Document.findOne({_id : id});

//         if(!document){
//            return res.status(404).json({message : "No document is avilable of provided id"});
//         }

//         // const accessedMembers = [];
//         // document.permissions.map((perm)=>accessedMembers.push(perm.user));
//         const accessedMembers = document.permissions.map(p => String(p.user));

        
//         const team = await Team.findById(document.team);
//         if (!team) {
//             return res.status(404).json({ message: "Team not found" });
//         }

//         const teamMemberIds = team.members.map(id => String(id));

//         const notAccessMembers = [];
//         accessedMembers.map((member)=>{
//             if(!teamMemberIds.includes(String(member))){
//                 notAccessMembers.push(member);
//             }
//         })


//         console.log("Completed getTeamMembers successfully in yourDocuments.js");
//         res.status(200).json(notAccessMembers);
//     }
//     catch(error){
//         res.status(400).json({error : error.message});
//     }
// }

exports.getTeamMembers = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findOne({ _id: id })
            .populate('permissions.user', '_id name email role')
            .populate('owner', '_id');

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        if (!document.team) {
            return res.status(404).json({ message: "Document has no associated team" });
        }

        const team = await Team.findById(document.team)
            .populate({
                path: 'members',
                select: 'name email role avatar',
                match: { 
                    _id: { 
                        $ne: null,
                        $ne: document.owner?._id 
                    } 
                }
            });

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        const accessedMemberIds = document.permissions
            .filter(p => p.user)
            .map(p => String(p.user._id));

        const membersWithoutAccess = team.members.filter(member => 
            member && !accessedMemberIds.includes(String(member._id))
        );

        res.status(200).json(membersWithoutAccess);
    } catch (error) {
        console.error("Error in getTeamMembers:", error);
        res.status(500).json({ error: error.message });
    }
}

exports.removeDocument = async (req,res) =>{
    try{
        const userId = req.user.userId;
        const {id} = req.params;

        if (!id ) {
            return res.status(400).json({ message: "Document ID and an array of users are required" });
        }

        const document = await Document.findOne({_id : id});

        if(!document){
           return res.status(404).json({message : "No document is avilable of provided id"});
        }

        if(document.owner.toString()!==userId){
            return res.status(401).json({message : "You doesnt have authority to remove document"});
        }

        await Document.deleteOne({_id:id});
        
        return res.status(201).json({message : "document deleted successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "failed to delete document ",error});
    }
}
exports.getOwner = async (req,res) =>{
    try{
        const userId = req.user.userId;
        const {id} = req.params;

        if (!id ) {
            return res.status(400).json({ message: "Document ID and an array of users are required" });
        }

        const document = await Document.findOne({_id : id}).populate({path: 'owner',select: 'name email _id'});

        if(!document){
           return res.status(404).json({message : "No document is avilable of provided id"});
        }

        if(!document.owner){
            return res.status(404).json({message : "No owner of document is available"});
        }
        const owner = document.owner;
        return res.status(201).json({message : "owner of document fetched successfully",owner: {
            _id: document.owner._id,
            name: document.owner.name,
            email: document.owner.email
        }});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "failed to delete document ",error});
    }
}

exports.getUserAccess = async (req,res) =>{
    try{
        const userId = req.user.userId;
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({ message: "Document ID and an array of users are required" });
        }

        const document = await Document.findById(id);

        if(!document){
           return res.status(501).json({message : "No document is avilable of provided id"});
        }
        const Permission= document.permissions.some((perm)=>perm.user.toString()===userId);
        const isOwner = document.owner.toString()===userId;

        if(!Permission && !isOwner){
            return res.status(400).json({ message: "Member is not have any access of this this document" });
        }
        if(!Permission){
            return res.status(201).json({message : "accessType of user is fetch successfully",accessType : "owner"});
        }

        return res.status(201).json({message : "accessType of user is fetch successfully",accessType : Permission});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "failed to get accessType of user ",error});
    }
}

const levenshteinDistance = (str1, str2) => {
    if (!str1 || !str2) return str1.length || str2.length;
  
    const matrix = Array.from({ length: str1.length + 1 }, () => []);
  
    for (let i = 0; i <= str1.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= str2.length; j++) matrix[0][j] = j;
  
    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // Deletion
          matrix[i][j - 1] + 1,      // Insertion
          matrix[i - 1][j - 1] + cost // Substitution
        );
      }
    }
  
    return matrix[str1.length][str2.length];
};

const THRESHOLD = 5; // Change percentage threshold (5%)

const shouldCreateNewVersion = (oldContent, newContent) => {
  const distance = levenshteinDistance(oldContent, newContent);
  const changePercentage = (distance / oldContent.length) * 100;

  return changePercentage >= THRESHOLD;
};


exports.updateDocument = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const { content } = req.body;
  
      const document = await Document.findById(id);
      if (!document) return res.status(404).json({ message: "Document not found" });
  
      // Get last version
      const lastVersion = document.versions.length > 0 ? document.versions[document.versions.length - 1] : null;
      const lastContent = lastVersion ? lastVersion.changes.modified[0] : "";
  
      // Check if content has changed significantly
      const shouldSaveVersion = lastVersion 
        ? shouldCreateNewVersion(lastContent, content)
        : true;
  
      // Check if 15 minutes have passed since last version
      const timeSinceLastVersion = lastVersion 
        ? (new Date() - new Date(lastVersion.timestamp)) / 60000
        : Infinity;
  
      if (shouldSaveVersion || timeSinceLastVersion >= 15) {
        document.versions.push({
          version_number: document.versions.length + 1,
          updated_by: userId,
          timestamp: new Date(),
          changes: { modified: [content] }
        });
      }
  
      document.content = content;
      await document.save();
  
      res.status(200).json({ message: "Document updated successfully", document });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to update document", error });
    }
  };
  
exports.saveVersion = async (documentId, content, title, userId, socket) => {
    try {
        const document = await Document.findById(documentId);
        if (!document) {
            return socket.emit("error", { message: "Document not found" });
        }

        const newVersion = {
            version_number: document.versions.length + 1,
            updated_by: userId,
            timestamp: new Date(),
            content: content,
            title : title,
            changes: {
                modified: [JSON.stringify(content)],
                added: [],
                removed: []
            }
        };

        document.versions.push(newVersion);

        if (title) {
            document.title = title; 
        }
        document.content = content;

        await document.save();

        socket.emit("version-saved", { message: "Version saved successfully", document });
    } catch (error) {
        console.error("Failed to save version:", error);
        socket.emit("error", { message: "Failed to save version", error });
    }
};

exports.getUserTeams = async (req,res) => {
    try{
        console.log("Entered into yourDocumentsController.js")
        const userId = req.user.userId;

        const teams = await Team.find({
            $or : [
                {Admin : userId},
                {members : userId}
            ]
        })

        console.log("Completed getUserTeams in yourDocumentsController.jsx");
        res.status(200).json(teams);
    }
    catch(error){
        res.status(400).json({error : error.message});
    }
}

exports.getDocumentTeam = async (req,res) => {
    try{
        console.log("Entered into yourDocumentsController.js")
        const {id} = req.params;
        const userId = req.user.userId;

        const document = await Document.findOne({_id : id})

        if(!document){
            console.log("Document of given id is not available");
            return;
        }
        console.log("Completed getDocumentTeam in yourDocumentsController.jsx");
        res.status(200).json(document.team);
    }
    catch(error){
        res.status(400).json({error : error.message});
    }
}

exports.getUserDocumentRelatedToTeam = async (req,res) =>{
    try{
        const userId = req.user.userId;
        const {teamId} = req.params;
        const documents = await Document.find({
            $or : [
                {owner : userId},
                {"permissions.members" : userId}
            ],
            team : teamId
        })
        console.log(documents);
        if(!documents){
            return res.status(404).json({message : "No documents are avilable"});
        }
        res.status(200).json({message : "documents of user related to team fetched successfully",documents});
    }
    catch(error){
        res.status(500).json({message : "failed to fetch user document related to team",error});
    }
}
  
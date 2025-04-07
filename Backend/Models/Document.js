const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    team: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Team",
        default : null 
    },
    format: { 
        type: String,
        enum: ["plain_text", "markdown", "docx", "pdf", "latex"], 
        
    },
    content : {
      type : Object,
      default: {},
    },

    permissions: [
      {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        },
        access: { 
            type: String, 
            enum: ["Viewer", "Editor"], 
            required: true 
        }
      }
    ],

    versions: [
      {
        version_number: { 
            type: Number, 
            required: true 
        },
        title : {
          type : String,
          required : true
        },
        content: {
          type: mongoose.Schema.Types.Mixed,
          required: true
        },        
        updated_by: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        timestamp: { 
            type: Date, 
            default: Date.now 
        },
        changes: {
          added: { type: [mongoose.Schema.Types.Mixed], default: [] },
          removed: { type: [mongoose.Schema.Types.Mixed], default: [] },
          modified: { type: [mongoose.Schema.Types.Mixed], default: [] }
        },
        
        storage_type: { 
            type: String, 
            enum: ["mongo", "cloud"], 
            default: "mongo" 
        },
        data_ref: {
          type: String,
          default: null
        }
      }
    ],

    cloud_storage: {
      enabled: { type: Boolean, default: false },
      provider: { type: String, enum: ["aws_s3", "firebase", "gcs", "none"], default: "none" },
      file_url: { type: String, default: "" }
    },
    isDeleted : {
      type : Boolean,
      default : false,
    },
    deletedAt: { 
      type: Date, 
      default: null 
    }
  },
  
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;

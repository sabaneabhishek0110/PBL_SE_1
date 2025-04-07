const express = require('express');
const userMiddleware = require('../Midlewares/userMiddleware');
const yourDocumentsController = require('../Controllers/yourDocumentsController');

const router = express.Router();

router.get('/getUserDocuments',userMiddleware,yourDocumentsController.getUserDocuments);
router.get('/getTeamMembers/:id',userMiddleware,yourDocumentsController.getTeamMembers);
router.get('/getUserAccess/:id',userMiddleware,yourDocumentsController.getUserAccess);
router.get('/getAccessedMembers/:id',userMiddleware,yourDocumentsController.getAccessedMembers);
router.get('/getUserTeams',userMiddleware,yourDocumentsController.getUserTeams);
router.get('/getDocumentTeam/:id',userMiddleware,yourDocumentsController.getDocumentTeam);
router.get('/getOwner/:id',userMiddleware,yourDocumentsController.getOwner);
router.get('/getUserDocumentRelatedToTeam/:teamId',userMiddleware,yourDocumentsController.getUserDocumentRelatedToTeam);

router.post('/createDocument',userMiddleware,yourDocumentsController.createDocument);

router.put('/giveAccess/:id',userMiddleware,yourDocumentsController.giveAccess);
router.put('/updateAccess/:id',userMiddleware,yourDocumentsController.updateAccess);
router.put('/revokeAccess/:id',userMiddleware,yourDocumentsController.revokeAccess);
router.put('/removeDocument/:id',userMiddleware,yourDocumentsController.removeDocument);
router.put('/updateDocument/:id',userMiddleware,yourDocumentsController.updateDocument);
router.put('/saveVersion/:id',userMiddleware,yourDocumentsController.saveVersion);

module.exports = router;
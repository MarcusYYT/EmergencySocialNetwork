import * as statusService from '../services/statusService.js'

export async function getStatusByUser(req, res){
    try{
        const user_id = req.params.user_id;
        await statusService.getStatusByUser(user_id).then((resolve)=>{
            if(resolve.exist==true){
                res.status(200).json({success:true, data: resolve.data, message:"Fetch status successful"});
            } else {
                res.status(404).json({success:false, data:[], message: resolve.message});
            }
        })
    }  catch (error) {
        res.status(500).send(error.message);
    }
}


export async function createStatus(req, res){
    try{
        const userId = req.body.user_id;
        const status = req.body.status;
        await statusService.createNewStatus(userId, status).then(() =>{
            res.status(201).json({ success: true, message: 'create a new status successfully'});
        })
    } catch(error) {
        res.status(500).send(error.message);
    }
}
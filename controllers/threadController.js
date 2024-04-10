import * as threadService from '../services/threadService.js'
import { io } from "../config/socketConfig.js"

export async function getThreadById(req, res){
    try{
        const thread_id = req.params.thread_id;
        await threadService.getThreadById(thread_id).then((resolve)=>{
            if(resolve.exist==true){
                res.status(200).json({success:true, data: resolve.data, message:"Fetch thread successful"});
            } else {
                res.status(404).json({success:false, data:[], message:"The thread does not exist"});
            }
        })
    }  catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getThreadList(req, res){
    try {
        await threadService.getThreadList().then((resolve)=>{
            res.status(200).json({success:true, data: resolve.data, message:resolve.message});
        })
    } catch (error){
        res.status(500).send(error.message);
    }
}

export async function postThread(req, res){
    try{
        const creator_id = req.body.creator_id;
        const thread_name = req.body.thread_name;
        const urgency = req.body.urgency;
        const tags = req.body.tags;

        // makes sure that the thread is unique
        if (await threadService.ifThreadNameExists(thread_name)) {
            res.status(500).json({ success: false, message: "Thread name already exists."});
        }
        else{
            await threadService.createNewThread(creator_id, thread_name, urgency, tags).then(async (result) => {
                // console.log("hello")
                // console.log(thing.data[0])
                //doing this in order to get the thread Id
                if (result.success){
                    await threadService.getThreadByName(thread_name).then((resolve) =>{
                        io.emit("threadData", resolve.data[0]);
                        res.status(201).json({ success: true, message: 'Post a new thread successfuli'});
                    })
                }
                else{
                    res.status(500).json({ success: false, message: 'Error posting a new thread' });
                }

            })
        }
       
    } catch(error) {
        res.status(500).send(error.message);
    }
}

export async function editThread(req, res){
    try{
        // const userId = req.body.user_id;
        const thread_id = req.body.thread_id
        const prev_thread_name = req.body.prev_thread_name;
        const thread_name = req.body.thread_name
        const urgency = req.body.urgency
        const tags = req.body.tags;

        //checks first if the name is getting changed
        if(thread_name != prev_thread_name){
            if (await threadService.ifThreadNameExists(thread_name)) {
                res.status(500).json({ success: false, message: "Thread name already exists."});
            }
            else{
                await threadService.editThread(thread_id, thread_name, urgency, tags).then((resolve)=>{
                    io.emit('edit_thread', thread_name)
                    res.status(200).json({success: resolve.success, message: resolve.message});
                })
            }
        } else{
            await threadService.editThread(thread_id, thread_name, urgency, tags).then((resolve)=>{
                console.log(resolve.data)
                io.emit('edit_thread', thread_name)
                res.status(200).json({success: resolve.success, message: resolve.message});
            })
        }
        

    } catch(error){
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

export async function deleteThread(req, res){
    try{
        const thread_id = req.params.thread_id
        await threadService.deleteThread(thread_id).then((resolve)=>{
            io.emit('delete_thread')
            res.status(200).json({success: resolve.success, message: resolve.message});
        })

    } catch(error){
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}
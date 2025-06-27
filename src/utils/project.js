const  supabase  = require("../lib/db/db");


const updateBio = async(req,res)=>{
    const {username,bio,profile_picture_url} = req.body

    if(!username || !bio || !profile_picture_url){
        res.json({message : "Request failed, please try again!"})
        res.status(400)
        return
    }

    const {data,error} = await supabase
    .from("user").insert({username,bio,profile_picture_url})

    if(error){
        res.json({message : "Request failed, please try again!",error})
        res.status(400)
        return
    }

    res.json({message : "Success add data!",data : data})
    res.status(200)
    return
}


const getProjectsData = async(req,res)=>{
    try{
        const {data, error} = await supabase
        .from("projects")
        .select(`*,
            tech_stack_project(
                tech_stacks (id,name,icon_url)
            )
            `)

        if(error){
            return res.status(404).json({message : "Data failed to serving!"})
        }

        return res.status(200).json({message : "success add data",data})
    }catch(error){
        console.log(error)
    }
}

const addProjectsData = async(req,res)=>{
    try{
    const {title,description,project_url,repo_url,image_url,created_at = new Date(),tech_stack_ids} = req.body
    const {data : insertedProject,error : errorProject} = await supabase
    .from("projects")
    .insert({title,description,project_url,repo_url,image_url,created_at})
    .select(`*, tech_stack_project(
        tech_stacks(
        id,
        name,
        icon_url
        )
    )
        `)

    if(errorProject){
        return res.status(500).json({message : "Internal server error",error :errorProject})
    }

    const projectId = insertedProject[0].id
    const pivotInsertTechStack = tech_stack_ids.map((tech_stack_id)=>({
        project_id : projectId,
        tech_stack_id
    }))

    const {error : pivotError} = await supabase
    .from("tech_stack_project")
    .insert(pivotInsertTechStack)

    if(pivotError){
        return res.status(500).json({message : "Internal server is error!",pivotError})
    }

    const {data : fullProject, error : fetchError} = await supabase
    .from("projects")
    .select(`*, tech_stack_project(
        tech_stacks(
        id,
        name
        )
    )`)
    .eq("id",projectId)
    .single()

    if(fetchError){
        return res.status(500).json({message : "Gagal ambil data lengkap",error:fetchError})
    }

    return res.status(200).json({message : "Success added project",fullProject})
}catch(error){
    return res.status(500).json({message : 'error',error : error})
}
}

const dropProjectData = async(req,res)=>{
    const id = Number(req.params.id)

    const {data : existingProject ,error : checkError} = await supabase
    .from("projects")
    .select("id")
    .eq(`id`,id)
    .single()

    if(checkError || !existingProject){
        return res.json({message : 'id not found!'})
    }

    const {error : deleteError} = await supabase
    .from("projects")
    .delete()
    .eq('id',id)

    if(deleteError){
        return res.status(500).json({message : "Failed to delete project",error : deleteError})
    }
    return res.status(200).json({ message : `Project with ID ${id} successfully deleted.` });
}

const getProjectStack = async(req,res)=>{
    try{
        const {data,error} =await supabase
        .from("tech_stacks")
        .select("*")
        
        if(error){
        return res.status(500).json({message : "Data invald",error})
        }

        return res.status(200).json({message : "success",data})
    }catch(error){
        return res.status(500).json({message : "error!",error})

    }
}


module.exports = {
    dropProjectData,
    addProjectsData,
    updateBio,
    getProjectsData,
    getProjectStack
}
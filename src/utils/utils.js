const  supabase  = require("../lib/db/db");
const {cloudMediaService} = require("../lib/media/cl")


const getAData = async (req,res)=>{
    const {data,error} = await supabase
    .from("user")
    .select(`*, social_media(*)`)


    if(error){
        res.json({message : "Failed to fetching data. Try again!"})
        res.status(400)
        return
    }

    return res.json({message : "Success fetching data",data})
}


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



const registerData = async (req,res)=>{ 
    const {phone,username,password,email} = req.body;
    if(!username|| !password || !email ){
        res.status(400)
        res.json({
            message : "bad request"
        })
        return
    }

    const {data,error} = await supabase.auth.signUp({
        password,
        options : {
            data : {
                username,
                phone,
                role : "admin"
            }
        },
        email
    })


    if(error){
        res.status(404).json({message : "Login failed please try again!",error})
    }

    return res.json({
        message : "Berhail daftar",
        data
    })
}

const loginData = async (req,res)=>{
    const {email,password} = req.body;
    if(!email|| !password){
    res.status(400)
    return res.json({message : "Gagal masuk"})    
    }

    const {data,error} = await supabase.auth.signInWithPassword({
        email : email,
        password : password
    })

    if(error){
       return res.status(404).json({message : "Login failed please try again!",error})
    }
    res.status(200)
    
     const token = data?.session?.access_token;

    res.json({
    message : "Berhasil masuk",
    token,
    user: data.user
    })


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
    const {title,description,project_url,repo_url,image_url,created_at,tech_stack_ids} = req.body
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
        return res.status(500).json({message : "Internal server error",error})
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
}

const dropProjectData = async(req,res)=>{
    const id = req.params.id

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


module.exports = {
    dropProjectData,
    addProjectsData,
    getAData,
    registerData,
    loginData,
    updateBio,
    getProjectsData
}
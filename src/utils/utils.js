const { supabase } = require("../lib/db/db");
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


const addProjects = async (req, res) => {
  const {
    title,
    description,
    project_url,
    repo_url,
    image_url,
    created_at,
    tech_stack_ids, // ini array, contoh: [1, 2, 3]
  } = req.body;

  // 1. Insert project dulu
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([
      {
        title,
        description,
        project_url,
        repo_url,
        image_url,
        created_at,
      },
    ])
    .select()
    .single();

  if (projectError) {
    return res.status(500).json({ error: projectError.message });
  }

  // 2. Masukkan tech_stack_ids ke tabel pivot
  const pivotData = tech_stack_ids.map((stackId) => ({
    project_id: project.id,
    tech_stack_id: stackId,
  }));

  const { error: pivotError } = await supabase
    .from('project_tech_stacks')
    .insert(pivotData);

  if (pivotError) {
    return res.status(500).json({ error: pivotError.message });
  }

  res.json({ message: 'Project and tech stacks added successfully', project });
};


const getProjectsData = async(req,res)=>{
    try{
        const {data, error} = await supabase
        .from("projects")
        .select(`*,
            tech_stack_project(
                tech_stacks (id,name)
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

module.exports = {getAData,registerData,loginData,updateBio,addProjects,getProjectsData}
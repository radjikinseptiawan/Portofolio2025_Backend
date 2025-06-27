const supabase = require("../lib/db/db")

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

module.exports = {loginData,registerData,getAData}
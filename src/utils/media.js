const supabase = require("../lib/db/db")



const addImage = async (req,res)=>{
    const file = req.file
    const filename = Date.now() + '-' + file.originalname
    console.log(file)
    const {data,error} = await supabase.storage
    .from("projects")
    .upload(`projects_image/${filename}`,file.buffer,{
        cacheControl : '3600',
        upsert : false,
        contentType : file.mimetype
    })

    if(error){
        return res.status(500).json({message : "upload error",error})
    }

    return res.status(200).json({message : 'upload success',data})
}



module.exports = {addImage}
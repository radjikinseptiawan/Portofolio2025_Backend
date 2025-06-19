const express = require("express")
const app = express()
const cors =  require('cors')
const port = 3006
const router = require("./router/router")

app.use(cors("*"))
app.use(express.json())

app.use("/",router)

app.use("/",(req,res)=>{
    res.json({message : "Error 404"})
})
app.listen(port,()=>{
    console.log(`http://localhost:3006`)
})

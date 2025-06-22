const {createClient} = require("@supabase/supabase-js")
const dotenv = require("dotenv")

dotenv.config()

const supabaseUrl = process.env.PROJECT_URL
const supabaseAPI = process.env.API_KEY

const supabase = createClient(supabaseUrl,supabaseAPI)

module.exports = supabase
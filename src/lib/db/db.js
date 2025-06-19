
import { createClient } from "@supabase/supabase-js"
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.PROJECT_URL
const supabaseAPI = process.env.API_KEY

export const supabase = createClient(supabaseUrl,supabaseAPI)


const supabase = require("../lib/db/db")

const verifySupabaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header malformed or missing" });
  }

  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ message: "Invalid Supabase token", error : error});
  }

  req.user = user;
  next();
};



module.exports = verifySupabaseToken;
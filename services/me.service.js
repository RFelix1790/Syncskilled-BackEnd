import User from '../models/UserSchema.js'
import {comparePassword, hashPassword} from '../utils/security.js'


export async function getMeService(req, res) {
  return res.json({ user: req.user });
}

export async function patchMeService(req,res){
  try {
    const { name, bio, locationCity, profilePhoto, username, email } = req.bod || {}
    const updates = {}
  } catch (error) {
    
  }
}

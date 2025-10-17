import Project from "../models/project.model.js";
import { createProject, getAllProjectByUserId, getProjectById } from "../services/project.service.js";
import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {name} = req.body;
    const creatorId = req.user._id;

    console.log(creatorId,name)

    if(!name || !creatorId) return res.status(400).json({errors:"Name and creator-id are required"})

    const newProject = await createProject(name,creatorId);

    res.status(201).json({newProject});

  } catch (error) {
    console.log(error)
    res.status(500).json({errors:error.message})
  }

};


export const getAllProject = async (req , res) => {
  try {

        const loggedInUser = req.user;

        if(!loggedInUser){
            return res.status(401).json({error:"Unauthorized"});
        }
        const allUserProjects = await getAllProjectByUserId({
            userId: loggedInUser._id
        })
        res.set({
  'Cache-Control': 'private, no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
});
        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
};

export const addUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let { userIds, projectId } = req.body;
    const loggedInUser = req.user;

    if (!userIds || !projectId) return res.status(400).json({ errors: "userIds and projectId are required" });

    if (!loggedInUser) return res.status(401).json({ errors: "Unauthorized" });

    // accept single id or array
    if (!Array.isArray(userIds)) userIds = [userIds];

    // Check if ids are valid mongoose ObjectIds
    const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);



    const invalidFormatIds = userIds.filter((id) => !isValidId(id));

    
    if (invalidFormatIds.length)
      return res.status(400).json({ errors: `Invalid userIds: ${invalidFormatIds.join(", ")}` });

    if (!isValidId(projectId)) return res.status(400).json({ errors: "Invalid projectId" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ errors: "Project not found" });

    // only creator can add users
    if (project.creator.toString() !== loggedInUser._id.toString()) {
      return res.status(403).json({ errors: "Only creator can add user to project" });
    }

    // prepare existing user id strings for quick check
    const existing = new Set(project.users.map((u) => u.toString()));

    const notFound = [];
    const toAdd = [];

    for (const id of userIds) {
      if (existing.has(id)) continue; // skip already added
      const user = await User.findById(id);
      if (!user) {
        notFound.push(id);
        continue;
      }
      toAdd.push(id);
    }

    if (notFound.length)
      return res.status(404).json({ errors: `Users not found: ${notFound.join(", ")}` });

    if (toAdd.length === 0)
      return res.status(400).json({ errors: "No new valid users to add" });

    project.users.push(...toAdd);
    await project.save();

    res.status(200).json({ msg: "Users added to project successfully", project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: error.message });
  }
};

export const removeUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, projectId } = req.body;
    const loggedInUser = req.user;

    if (!userId || !projectId) return res.status(400).json({ errors: "userId and projectId are required" });

    if (!loggedInUser) return res.status(401).json({ errors: "Unauthorized" });

    if (!mongoose.Types.ObjectId.isValid(userId)) 
      return res.status(400).json({ errors: "Invalid userId" });

    if (!mongoose.Types.ObjectId.isValid(projectId)) 
      return res.status(400).json({ errors: "Invalid projectId" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ errors: "Project not found" });

    if (project.creator.toString() !== loggedInUser._id.toString()) {
      return res.status(403).json({ errors: "Only creator can remove user from project" });
    }

    if (!project.users.includes(userId)) {
      return res.status(404).json({ errors: "User not found in project" });
    }

    project.users = project.users.filter(id => id.toString() !== userId.toString());
    await project.save();
    res.status(200).json({ msg: "User removed from project successfully", project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: error.message });
  }
};


export const getProject = async (req, res) => {
  try {
    const {projectId} = req.params;
    if(!projectId){
      return res.status(400).json({errors:"ProjectId is required"});
    }
    const project = await getProjectById(projectId);

    if(!project){
      return res.status(404).json({errors:"Project not found"});
    }

    return res.status(200).json({project});



  } catch (error) {
    console.log(error)
    req.status(500).json({errors:error.message})
  }
};
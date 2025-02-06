const { catchAsyncError } = require("../../middleware/catchAsyncError");
const ProjectServices = require('../../services/project/project.services');
const { ErrorHandler } = require("../../utils/errorHandler.util");

const getAllProject = catchAsyncError(async (req, res, next) => {
    const project = await ProjectServices.getAll();

    return res.status(200).json({
        success: true,
        data: project
    })
})

const createProject = catchAsyncError(async (req, res, next) => {
    const {name, description, status} = req.body;

    if(!name || !description){
        return next(new ErrorHandler('Missing required fields', 400))
    }

    const validStatus = ['PLANNED', 'ONGOING', 'COMPLETED']
    if(!status || !validStatus.includes(status)){
        return next(new ErrorHandler('Invalid status.', 400))
    }

    const userId = req.user.id;

    let payload = {name, description, userId};
    if(status) payload = {...payload, status};

    const project = await ProjectServices.create(payload);

    return res.status(200).json({
        success: true,
        data: project
    })
})

const updateProject = catchAsyncError(async (req, res, next) => {
    const {name, description, status} = req.body;
    const {id} = req.params;

    if(!name && !description && !status){
        return next(new ErrorHandler('Missing required fields', 400))
    }

    const projectData = await ProjectServices.getById(id);
    if (!projectData) {
        return next(new ErrorHandler("Invalid ID provided", 400))
    }

    if(projectData.userId !== req.user.id){
        return next(new ErrorHandler("You are not have the access of the project", 403))
    }

    const validStatus = ['PLANNED', 'ONGOING', 'COMPLETED']
    if(status && !validStatus.includes(status)){
        return next(new ErrorHandler('Invalid status.', 400))
    }

    let payload = {name, description};
    if(name) payload = {...payload, name};
    if(status) payload = {...payload, status};
    if(description) payload = {...payload, description};

    const project = await ProjectServices.updateById(id, payload);

    return res.status(200).json({
        success: true,
        data: project
    })
})

const deleteProject = catchAsyncError(async (req, res, next) => {
    const {id} = req.params;

    const projectData = await ProjectServices.getById(id);
    if (!projectData) {
        return next(new ErrorHandler("Invalid ID provided or already deleted", 400))
    }
    if(projectData.userId !== req.user.id){
        return next(new ErrorHandler("You are not have the access of the project", 403))
    }

    await ProjectServices.deleteById(id);

    res.status(200).json({
        success: true,
        message: "Successfully deleted the project"
    })
})

module.exports = {
    getAllProject,
    createProject,
    updateProject,
    deleteProject
}


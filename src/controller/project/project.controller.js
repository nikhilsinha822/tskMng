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

    let payload = {name, description};
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

    const isValid = await ProjectServices.getById(id);
    if (!isValid) {
        return next(new ErrorHandler("Invalid ID provided", 400))
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

    const isValid = await ProjectServices.getById(id);
    if (!isValid) {
        return next(new ErrorHandler("Invalid ID provided or already deleted", 400))
    }

    await ProjectServices.softDeleteById(id);

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


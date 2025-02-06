const { catchAsyncError } = require("../../middleware/catchAsyncError");
const TaskServices = require('../../services/task/task.services');
const ProjectServices = require('../../services/project/project.services')
const { ErrorHandler } = require("../../utils/errorHandler.util");

const getAllProjectTask = catchAsyncError(async (req, res, next) => {
    const { projectId } = req.params;
    const Task = await TaskServices.getAllByProject(projectId);

    return res.status(200).json({
        success: true,
        data: Task
    })
})

const getAllTaskByFilter = catchAsyncError(async (req, res, next) => {
    const { assignedUserId, status } = req.query;

    const validStatus = ['TODO', 'IN_PROGRESS', 'DONE']
    if (status && !validStatus.includes(status)) {
        return next(new ErrorHandler('Invalid status.', 400))
    }

    let filter = {};
    if (assignedUserId) filter = { ...filter, assignedUserId }
    if (status) filter = { ...filter, status }

    const tasks = await TaskServices.getAllByFilter(filter);

    return res.status(200).json({
        success: true,
        data: tasks
    })
})

const createProjectTask = catchAsyncError(async (req, res, next) => {
    const { title, description, status, userId } = req.body;
    const { projectId } = req.params;
    const assignedUserId = req.user.id;

    if (!title || !description) {
        return next(new ErrorHandler('Missing required fields', 400))
    }

    const validStatus = ['TODO', 'IN_PROGRESS', 'DONE']
    if (!status || !validStatus.includes(status)) {
        return next(new ErrorHandler('Invalid status.', 400))
    }

    const validProject = await ProjectServices.getById(projectId);
    if (!validProject) {
        return next(new ErrorHandler('Invalid project ID provided', 400))
    }

    const payload = { title, description, projectId, status, assignedUserId };
    if (userId) payload = { ...payload, userId }
    const Task = await TaskServices.create(payload);

    return res.status(200).json({
        success: true,
        data: Task
    })
})

const updateTask = catchAsyncError(async (req, res, next) => {
    const { status, userId: assignedUserId } = req.body;
    const { id: taskId } = req.params;

    if (!status && !assignedUserId) {
        return next(new ErrorHandler('Missing required fields', 400))
    }

    const validStatus = ['TODO', 'IN_PROGRESS', 'DONE']
    if (status && !validStatus.includes(status)) {
        return next(new ErrorHandler('Invalid status', 400))
    }

    const validTask = await TaskServices.getById(taskId);
    if (!taskId || !validTask) {
        return next(new ErrorHandler('Invalid Task ID', 400))
    }

    let payload = {};
    if (status) payload = { ...payload, status };
    if (assignedUserId) payload = { ...payload, assignedUserId };

    const Task = await TaskServices.updateById(taskId, payload);
    if(Task.assignedUserId !== req.user.id){
        return next(new ErrorHandler("You are not have the access of the task", 403))
    }

    return res.status(200).json({
        success: true,
        data: Task
    })
})

const deleteTask = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const Task = await TaskServices.getById(id);
    if (!Task) {
        return next(new ErrorHandler("Invalid ID provided or already deleted", 400))
    }
    if(Task.assignedUserId !== req.user.id){
        return next(new ErrorHandler("You are not have the access of the task", 403))
    }

    await TaskServices.deleteById(id);

    res.status(200).json({
        success: true,
        message: "Successfully deleted the Task"
    })
})

module.exports = {
    getAllProjectTask,
    createProjectTask,
    getAllTaskByFilter,
    updateTask,
    deleteTask
}


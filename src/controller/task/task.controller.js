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

const createProjectTask = catchAsyncError(async (req, res, next) => {
    const { title, description, status, userId } = req.body;
    const { projectId } = req.params;

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

    const payload = { title, description, projectId, status };
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

    return res.status(200).json({
        success: true,
        data: Task
    })
})

const deleteTask = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const isValid = await TaskServices.getById(id);
    if (!isValid) {
        return next(new ErrorHandler("Invalid ID provided or already deleted", 400))
    }

    await TaskServices.softDeleteById(id);

    res.status(200).json({
        success: true,
        message: "Successfully deleted the Task"
    })
})

module.exports = {
    getAllProjectTask,
    createProjectTask,
    updateTask,
    deleteTask
}


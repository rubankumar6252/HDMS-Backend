import Task from "../model/TaskSchema.js";

const getTask = async (req, res) => {
    try {
        const data = await Task.find();
        if (data) {
            res.send(data);
        } else {
            res.send("No data assign to admin")
        }
    } catch (err) {
        console.error(err);
    }
};

export { getTask };
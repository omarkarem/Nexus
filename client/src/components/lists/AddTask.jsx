import { useState } from "react";

const AddTask = ({ boardId }) =>{
    return(
        <div className="w-full border-b border-glass-border py-2 hover:text-white">
            <button className="text-md">+ Add Task</button>
        </div>
    )
}

export default AddTask;
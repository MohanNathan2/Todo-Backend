import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const apiUrl = "http://localhost:8000"

    useEffect(() => {
        getItem();
    }, [])

    const handleSubmit = () => {
        setError("")
        if (title.trim() !== '' && description.trim() !== "") {

            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }]);
                    setMessage("Item added succesfuly");
                    setTitle("");
                    setDescription("")
                    setTimeout(() => {
                        setMessage("")
                    }, 2000)
                } else {
                    setError("Unable to create todo item")
                }
            }).catch(() => {
                setError("Unable to create todo item")
            })
        }
    }

    const getItem = () => {
        fetch(apiUrl + '/todos')
            .then((res) => res.json())
            .then((res) => {
                setTodos(res)
            })
    }

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description)
    }

    const handleUpdate = () => {
        setError("")
        if (editTitle.trim() !== '' && editDescription.trim() !== "") {
            fetch(apiUrl + `/todos/${editId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: editTitle,description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    const updatedTodos = todos.map((item) => {
                        if(item._id === editId){
                            item.title = editTitle;
                            item.description = editDescription
                        }
                        return item;
                    })
                    setTodos(updatedTodos);
                    setMessage("Item updated succesfuly");
                    setEditTitle("");
                    setEditDescription("");
                    setTimeout(() => {
                        setMessage("")
                    }, 2000)
                    setEditId(-1);
                } else {
                    setError("Unable to update todo item")
                }
            }).catch(() => {
                setError("Unable to update todo item")
            })
        }
    }

    const handleCancel = () => {
        setEditId(-1);
    }

    const handleDelete = (id) => {
        if(window.confirm('Are you sure want to delete.')){
            fetch(apiUrl + `/todos/${id}`, {
                method: "DELETE",
            }).then(() => {
               const updatedTodos =  todos.filter((item) => item._id !== id)
               setTodos(updatedTodos)
            })
        }
    }

    return <><div className="row p-3 bg-success text-light">
        <h1>ToDo Project with MERN Stack</h1>
    </div>
        <div className="row">
            <h3>Add Item</h3>
            {message && <p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">
                <input value={title} placeholder="Title" className="form-control" type="text" onChange={(e) => setTitle(e.target.value)} />
                <input value={description} placeholder="Description" className="form-control" type="text" onChange={(e) => setDescription(e.target.value)} />
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
            {error && <p className="text-danger">{error}</p>}
        </div>
        <div className="row mt-3">
            <h3>Tasks</h3>
            <div className="col-md-6">
                <ul className="list-group">
                    {todos.map((data) =>
                        <li className="list-group-item bg-info d-flex justify-content-between align-item-center my-2">
                            <div className="d-flex flex-column me-2">
                                {
                                    editId === -1 || editId !== data._id ? <>
                                        <span className="fw-bold">{data.title}</span>
                                        <span >{data.description}</span>
                                    </> : <div className="form-group d-flex gap-2">
                                        <input value={editTitle} placeholder="Title" className="form-control" type="text" onChange={(e) => setEditTitle(e.target.value)} />
                                        <input value={editDescription} placeholder="Description" className="form-control" type="text" onChange={(e) => setEditDescription(e.target.value)} />
                                    </div>
                                }

                            </div>
                            <div className="d-flex gap-2">
                                {editId === -1 ? <button className="btn btn-warning" onClick={() => handleEdit(data)}>Edit</button> : <button className="btn btn-warning" onClick={handleUpdate}>Update</button>}
                                {editId === -1 ? <button className="btn btn-danger" onClick={() => handleDelete(data._id)}>Delete</button> :
                                    <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>}
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    </>
}
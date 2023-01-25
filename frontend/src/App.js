import React, { Component } from 'react';
import './App.css';
import CustomModal from './components/Modal';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      viewCompleted: false,
      taskList: [],
      activeItem: {
        title: "",
        description: "",
        completed: false
      }
    };
  }
  componentDidMount() {
    this.refreshList();
  }
  refreshList = () => {
    axios
      .get("http://localhost:8000/api/tasks/")
      .then(res => this.setState({ taskList: res.data }))
      .catch(err => console.log(err))
  };


  // Toggle the modal
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  // Handle the form submission
  handleSubmit = item => {
    this.toggle();
    if(item.id) {
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
        .then(res => this.refreshList());
      return;
    }
    axios
      .post("http://localhost:8000/api/tasks/", item)
      .then(res => this.refreshList());
  };
  // Handle the edit button
  handleEdit = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  // Handle the delete button
  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}`)
      .then(res => this.refreshList());
  };
  // Handle the completed checkbox
  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };




  displayCompleted = status => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };
  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          Completed
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incompleted
        </span>
      </div>
    );
  }
  // Render the list of tasks
  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.taskList.filter(
      item => item.completed === viewCompleted
    );
    return newItems.map(item => (
      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
        <span className={`task-title mr-2 ${this.state.viewCompleted ? "completed-task" : ""}`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button onClick={()=>this.handleEdit(item)} className="btn btn-secondary mr-2">Edit</button>
          <button onClick={()=>this.handleDelete(item)} className="btn btn-danger">Delete</button>
        </span>
      </li>
    ));
  }

  render() {
    return (
      <main className = "content p-3 mb-2 bg-info">
        <h1 className="text-white text-uppercase text-center my-4">Task Manager</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={() => this.createItem} className="btn btn-primary">Add task</button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <footer className="my-3 mb-2 bg-info text-white bg-info"> Copyright 2021 &copy; FIFI CORP </footer>
        {this.state.modal ? (
          <CustomModal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit} />
        ) : null}
      </main>
    );
  }
}




export default App;

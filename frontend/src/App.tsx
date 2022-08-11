import React, {Component} from "react";
import Modal from "./components/Modal";
import axios from "axios";

class App extends Component<{}, { activeItem: { title: string, description: string, completed: boolean }, modal: boolean, todoList: any, viewCompleted: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = {
            viewCompleted: false,
            todoList: [],
            modal: false,
            activeItem: {
                title: "",
                description: "",
                completed: false,
            },
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        axios
            .get("/api/todos/")
            .then((res) => this.setState({todoList: res.data}))
            .catch((err) => console.log(err));
    };

    toggle = () => {
        this.setState({modal: !this.state.modal});
    };

    handleSubmit = (item: any) => {
        this.toggle();

        if (item.id) {
            axios
                .put(`/api/todos/${item.id}/`, item)
                .then((res) => this.refreshList());
            return;
        }
        axios
            .post("/api/todos/", item)
            .then((res) => this.refreshList());
    };

    handleDelete = (item: any) => {
        axios
            .delete(`/api/todos/${item.id}/`)
            .then((res) => this.refreshList());
    };

    createItem = () => {
        const item = {title: "", description: "", completed: false};

        this.setState({activeItem: item, modal: !this.state.modal});
    };

    editItem = (item: any) => {
        this.setState({activeItem: item, modal: !this.state.modal});
    };

    displayCompleted = (status: boolean) => {
        if (status) return this.setState({viewCompleted: true});


        return this.setState({viewCompleted: false});
    };

    renderTabList = () => {
        return (
            <div className="nav nav-tabs">
                <span
                    className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
                    onClick={() => this.displayCompleted(true)}
                >
                    Complete
                </span>
                <span
                    className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
                    onClick={() => this.displayCompleted(false)}
                >
                    Incomplete
                </span>
            </div>
        );
    };

    renderItems = () => {
        const {viewCompleted} = this.state;
        const newItems = this.state.todoList.filter(
            (item: { completed: any; }) => item.completed === viewCompleted
        );

        return newItems.map((item: { id: React.Key | null | undefined; description: string | undefined; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
            <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
            >
        <span
            className={`todo-title mr-2 ${
                this.state.viewCompleted ? "completed-todo" : ""
            }`}
            title={item.description}
        >
          {item.title}
        </span>
                <span>
          <button
              className="btn btn-secondary mr-2"
              onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button
              className="btn btn-danger"
              onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
            </li>
        ));
    };

    render() {
        return (
            <main className="container">
                <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
                <div className="row">
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            <div className="mb-4">
                                <button
                                    className="btn btn-primary"
                                    onClick={this.createItem}
                                >
                                    Add task
                                </button>
                            </div>
                            {this.renderTabList()}
                            <ul className="list-group list-group-flush border-top-0">
                                {this.renderItems()}
                            </ul>
                        </div>
                    </div>
                </div>
                {this.state.modal ? (
                    <Modal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}
            </main>
        );
    }
}

export default App;
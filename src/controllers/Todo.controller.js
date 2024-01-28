import { Todo } from "../models/todo.model.js";
import { createNewTodo } from "../utils/types.js";

const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find({});
    if (!todos) return res.status(500).send({ msg: "something went wrong" });
    return res
      .status(200)
      .send({ msg: "successfully fetched all the todos", todos });
  } catch (error) {
    console.log("something went wrong while fetching the todos", error.message);
  }
};

const getUserTodo = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    const todos = await Todo.find({ createdBy: user._id });
    res.status(200).send({ msg: "successfully got the todos", todos });
  } catch (error) {
    console.log("something went wrong while fetching the data", error.message);
  }
};

const deleteTodo = async (req, res) => {
  try {
    const id = req.body.id;
    const createdBy = req.user._id;
    // console.log(id);
    const findtodo = await Todo.findOneAndDelete({ _id: id, createdBy });
    if (!findtodo) return res.send("todo does not exist");
    res.status(200).send({ msg: "successful", findtodo });
  } catch (error) {
    console.log("something went wrong", error.message);
  }
};

const postTodo = async (req, res) => {
  try {
    const addTodo = req.body;
    const user = req.user;
    const todo = createNewTodo.safeParse(addTodo);
    if (!todo.success) {
      res.status(411).send({ msg: "You have send wrong inputs" });
    } else {
      const { title, description } = addTodo;
      const createTodo = await Todo.create({
        title,
        description,
        createdBy: user._id,
      });
      console.log(createTodo);
      res.status(200).send({ msg: "New todo created" });
    }
  } catch (error) {
    console.log(error);
  }
};

export { deleteTodo, getUserTodo, postTodo, getAllTodos };

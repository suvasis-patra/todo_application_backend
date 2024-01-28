import zod from "zod";
export const createNewTodo = zod.object({
  title: zod.string(),
  description: zod.string(),
  createdBy: zod.string(),
});

export const updateTodo = zod.object({
  id: zod.string(),
});

export const userSignup = zod.object({
  username: zod.string().min(2),
  password: zod.string().min(8),
  email: zod.string().email(),
});

export const userLogin = zod.object({
  password: zod.string().min(8),
  email: zod.string().email(),
});

import { Task } from "@/api/types";
import { createColumnHelper } from "@tanstack/react-table";

export const createTaskColumn = createColumnHelper<Task>();

/**
 * TypeScript Interfaces for Tasks API
 */

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @api {post} /api/tasks Create Task
 * @apiName CreateTask
 * @apiGroup Tasks
 * @apiVersion 1.0.0
 * @apiDescription Create a new task
 *
 * @apiSchema (body) {jsonschema=./tasks.ts#Task} Task object
 *
 * @apiParam {String} title Task title (required)
 * @apiParam {String} [description] Task description
 * @apiParam {String="pending","in_progress","completed"} [status=pending] Task status
 * @apiParam {String="low","medium","high"} [priority=medium] Task priority
 * @apiParam {Date} [dueDate] Due date
 * @apiParam {String[]} [tags] Task tags
 *
 * @apiSuccess {Number} id Task ID
 * @apiSuccess {String} title Task title
 * @apiSuccess {String} status Task status
 *
 * @apiExample {curl} Example:
 *     curl -X POST https://api.example.com/api/tasks \
 *       -H "Content-Type: application/json" \
 *       -d '{"title": "Complete project", "priority": "high", "tags": ["work"]}'
 */
export function createTask(req: any, res: any) {}

/**
 * @api {get} /api/tasks/:id Get Task
 * @apiName GetTask
 * @apiGroup Tasks
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id Task ID
 *
 * @apiSuccess {Number} id Task ID
 * @apiSuccess {String} title Task title
 * @apiSuccess {String} description Task description
 * @apiSuccess {String} status Task status
 * @apiSuccess {String} priority Task priority
 * @apiSuccess {Date} dueDate Due date
 * @apiSuccess {String[]} tags Task tags
 * @apiSuccess {Date} createdAt Creation date
 * @apiSuccess {Date} updatedAt Last update date
 */
export function getTask(req: any, res: any) {}

/**
 * @api {put} /api/tasks/:id Update Task
 * @apiName UpdateTask
 * @apiGroup Tasks
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id Task ID
 * @apiParam {String} [title] Task title
 * @apiParam {String} [description] Task description
 * @apiParam {String} [status] Task status
 * @apiParam {String} [priority] Task priority
 *
 * @apiSuccess {Object} task Updated task
 */
export function updateTask(req: any, res: any) {}

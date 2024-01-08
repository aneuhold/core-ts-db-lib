import { ObjectId } from 'bson';
import BaseDocumentWithType from '../BaseDocumentWithType';
import RequiredUserId from '../../schemas/required-refs/RequiredUserId';
import Validate from '../../schemas/validators/ValidateUtil';
import { DocumentValidator } from '../../schemas/validators/DocumentValidator';

export const validateDashboardTask: DocumentValidator<DashboardTask> = (
  task: DashboardTask
) => {
  const errors: string[] = [];
  const validate = new Validate(task, errors);
  const exampleTask = new DashboardTask(new ObjectId());

  validate.string('title', exampleTask.title);
  validate.boolean('completed', exampleTask.completed);
  validate.optionalString('description');
  validate.array('sharedWith', exampleTask.sharedWith);
  validate.array('tags', exampleTask.tags);
  validate.string('category', exampleTask.category);
  validate.object('createdDate', exampleTask.createdDate);
  validate.object('lastUpdatedDate', exampleTask.lastUpdatedDate);
  validate.optionalObject('startDate');
  validate.optionalObject('dueDate');

  return { updatedDoc: task, errors };
};

/**
 * Gets all the children task IDs for the given parent task IDs.
 */
export const getDashboardTaskChildrenIds = (
  allUserTasks: DashboardTask[],
  parentTaskIds: ObjectId[]
): ObjectId[] => {
  const parentToTaskIdsDict: Record<string, string[]> = {};
  const taskIdToTaskDict: Record<string, DashboardTask> = {};
  allUserTasks.forEach((task) => {
    taskIdToTaskDict[task._id.toString()] = task;
    if (task.parentTaskId) {
      if (!parentToTaskIdsDict[task.parentTaskId.toString()]) {
        parentToTaskIdsDict[task.parentTaskId.toString()] = [];
      }
      parentToTaskIdsDict[task.parentTaskId.toString()].push(
        task._id.toString()
      );
    }
  });
  const childrenIds: ObjectId[] = [];
  parentTaskIds.forEach((taskId) => {
    const task = taskIdToTaskDict[taskId.toString()];
    if (task) {
      const childrenTaskIds = getChildrenTaskIds(
        taskIdToTaskDict,
        parentToTaskIdsDict,
        taskId.toString()
      );
      childrenIds.push(...childrenTaskIds.map((id) => new ObjectId(id)));
    }
  });
  return childrenIds;
};

function getChildrenTaskIds(
  taskIdToTaskDict: Record<string, DashboardTask>,
  parentToTaskIdsDict: Record<string, string[]>,
  taskId: string
) {
  const childrenIds = parentToTaskIdsDict[taskId];
  if (!childrenIds) {
    return [];
  }
  childrenIds.forEach((childId) => {
    const childTask = taskIdToTaskDict[childId];
    if (childTask) {
      const grandchildrenIds = getChildrenTaskIds(
        taskIdToTaskDict,
        parentToTaskIdsDict,
        childId
      );
      childrenIds.push(...grandchildrenIds);
    }
  });
  return childrenIds;
}

/**
 * When thinking about the logic of tasks, the following thoughts come to mind:
 *
 * What would you expect a task manager to do in the case that you have a task
 * with a bunch of subtasks, and you share that single task with another person?
 *
 * - Should the subtasks be automatically shared as well no matter what? (Would make behavior simpler for the user)
 * - Should there instead be an option to share the subtasks automatically?
 * - In the case that the other user adds a subtask to the original task you shared, would you expect to see that subtask?
 * - If there is an option to not share the subtasks automatically, what happens when the other user adds a subtask to the one you shared?
 *
 * Because of the complexity for the user in not automatically sharing subtasks,
 * it seems better to always automatically share subtasks. In a theoretical sense,
 * sharing a task with someone seems to imply the shared ownership of completing
 * the overall task, including all the subtasks.
 */
export default class DashboardTask
  extends BaseDocumentWithType
  implements RequiredUserId
{
  static docType = 'task';

  docType = DashboardTask.docType;

  /**
   * The owner of this task.
   */
  userId: ObjectId;

  /**
   * The different users this task is shared with. This should be indexed
   * somehow.
   */
  sharedWith: ObjectId[] = [];

  title = '';

  completed = false;

  /**
   * The ID of the parent task if there is one.
   */
  parentTaskId?: ObjectId;

  /**
   * The description of the task. This is purposefully optional in case the
   * user wants to just use the title. This also helps the frontend
   * differentiate between a task that has no description and a task that has
   * an empty description.
   */
  description?: string;

  /**
   * The date this task was created.
   */
  createdDate = new Date();

  /**
   * The date this task was last updated.
   */
  lastUpdatedDate = new Date();

  startDate?: Date;

  dueDate?: Date;

  /**
   * User-assigned tags for this task.
   */
  tags: string[] = [];

  /**
   * System-assigned category for this task. This should be used to determine
   * where this task should be displayed.
   */
  category: string = 'default';

  constructor(ownerId: ObjectId) {
    super();
    this.userId = ownerId;
  }
}

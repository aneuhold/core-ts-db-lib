import { ObjectId } from 'bson';
import DashboardTask, {
  DashboardTaskMap
} from '../../../documents/dashboard/Task.js';
import { DashboardTaskListFilterSettings } from '../../../embedded-types/dashboard/task/FilterSettings.js';
import { RecurrenceFrequency } from '../../../embedded-types/dashboard/task/RecurrenceInfo.js';
import {
  DashboardTaskListSortSettings,
  DashboardTaskSortDirection
} from '../../../embedded-types/dashboard/task/SortSettings.js';
import { DashboardTagSettings } from '../../../embedded-types/dashboard/userConfig/Tags.js';
import DashboardTaskFilterService, {
  DashboardTaskFilterResult
} from './TaskFilterService.js';
import DashboardTaskRecurrenceService from './TaskRecurrenceService.js';
import DashboardTaskSortService from './TaskSortService.js';

/**
 * A type for the task filter settings for a particular task.
 */
export type DashboardTaskFilterTaskInfo = {
  taskId: string;
  allChildrenIds: string[];
};

export type DashboardTaskFilterAndSortResult = {
  filteredAndSortedIds: string[];
  /**
   * The IDs of the tasks that were filtered, but still apply to the same
   * category. Does not include tasks that were filtered because of grand
   * children tasks.
   */
  removedIds: string[];
};

export default class DashboardTaskService {
  /**
   * Gets all the children task IDs for the given parent task IDs.
   */
  static getChildrenIds = (
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
        const childrenTaskIds = this.getChildrenTaskIds(
          taskIdToTaskDict,
          parentToTaskIdsDict,
          taskId.toString()
        );
        childrenIds.push(...childrenTaskIds.map((id) => new ObjectId(id)));
      }
    });
    return childrenIds;
  };

  /**
   * Gets the next frequency date from the provided basis date. Returns null
   * if the provided frequency is in an invalid state.
   */
  static getNextFrequencyDate(
    basisDate: Date,
    frequency: RecurrenceFrequency
  ): Date | null {
    return DashboardTaskRecurrenceService.getNextFrequencyDate(
      basisDate,
      frequency
    );
  }

  /**
   * Moves the start and due date forward by one frequency.
   *
   * This does not take into account the recurrence effect. That should be
   * handled on the frontend.
   *
   * Makes no changes if the state of the task is invalid for recurrence or
   * there isn't recurrence info.
   */
  static updateDatesForRecurrence(task: DashboardTask): void {
    DashboardTaskRecurrenceService.updateDatesForRecurrence(task);
  }

  /**
   * Gets the filtered and sorted set of task ids for a particular category.
   *
   * @param category the category of the tasks to filter
   * @param filterSettings the filter settings for a task if there are any.
   * Otherwise, this will use the default filter settings for the user. If
   * the user does not have filter settings, then it will use the default.
   */
  static getFilteredAndSortedTaskIds(
    taskMap: DashboardTaskMap,
    category: string,
    filterSettings: DashboardTaskListFilterSettings,
    sortSettings: DashboardTaskListSortSettings,
    tagSettings: DashboardTagSettings,
    taskInfo?: DashboardTaskFilterTaskInfo
  ): DashboardTaskFilterAndSortResult {
    let filterResult: DashboardTaskFilterResult;

    if (!taskInfo) {
      filterResult = DashboardTaskFilterService.filter(
        taskMap,
        Object.keys(taskMap),
        filterSettings,
        category
      );
    } else {
      filterResult = DashboardTaskFilterService.filter(
        taskMap,
        taskInfo.allChildrenIds,
        filterSettings,
        category,
        taskInfo.taskId
      );
    }
    return {
      filteredAndSortedIds: DashboardTaskSortService.sort(
        taskMap,
        filterResult.resultIds,
        sortSettings,
        tagSettings
      ),
      removedIds: filterResult.removedIds
    };
  }

  /**
   * Gets a map of task IDs to tag header names. Used only for when sorting by
   * tags. If the first task in the list has no high-priority tags, then
   * noPriorityTagsIndicator will be used as the header name.
   */
  static getTagHeaderMap(
    taskMap: DashboardTaskMap,
    taskIds: string[],
    userId: string,
    tagSettings: DashboardTagSettings,
    noPriorityTagsIndicator: string,
    sortDirection: DashboardTaskSortDirection
  ): Record<string, string> {
    return DashboardTaskSortService.getTagHeaderMap(
      taskMap,
      taskIds,
      userId,
      tagSettings,
      noPriorityTagsIndicator,
      sortDirection
    );
  }

  private static getChildrenTaskIds(
    taskIdToTaskDict: Record<string, DashboardTask>,
    parentToTaskIdsDict: Record<string, string[]>,
    taskId: string
  ): string[] {
    const childrenIds = parentToTaskIdsDict[taskId];
    if (!childrenIds) {
      return [];
    }
    childrenIds.forEach((childId) => {
      const childTask = taskIdToTaskDict[childId];
      if (childTask) {
        const grandchildrenIds = this.getChildrenTaskIds(
          taskIdToTaskDict,
          parentToTaskIdsDict,
          childId
        );
        childrenIds.push(...grandchildrenIds);
      }
    });
    return childrenIds;
  }
}

import BaseDocument from './documents/BaseDocument';
import BaseDocumentWithType from './documents/BaseDocumentWithType';
import ApiKey, { validateApiKey } from './documents/common/ApiKey';
import User, { UserCTO, validateUser } from './documents/common/User';
import NonogramKatanaItem, {
  validateNonogramKatanaItem
} from './documents/dashboard/NonogramKatanaItem';
import NonogramKatanaUpgrade, {
  validateNonogramKatanaUpgrade
} from './documents/dashboard/NonogramKatanaUpgrade';
import DashboardTask, {
  DashboardTaskMap,
  validateDashboardTask
} from './documents/dashboard/Task';
import DashboardUserConfig, {
  validateDashboardUserConfig
} from './documents/dashboard/UserConfig';
import NonogramKatanaItemName from './embedded-types/dashboard/nonogramKatanaItem/ItemName';
import NonogramKatanaUpgradeName from './embedded-types/dashboard/nonogramKatanaUpgrade/UpgradeName';
import {
  DashboardTaskListGlobalFilterSettings,
  DashboardTaskFilterSettings,
  DashboardTaskListFilterSettings,
  getDefaultTaskListFilterSettings
} from './embedded-types/dashboard/task/FilterSettings';
import {
  ParentRecurringTaskInfo,
  RecurrenceBasis,
  RecurrenceEffect,
  RecurrenceFrequency,
  RecurrenceFrequencyType,
  RecurrenceInfo
} from './embedded-types/dashboard/task/RecurrenceInfo';
import {
  DashboardTaskListGlobalSortSettings,
  DashboardTaskListSortSettings,
  DashboardTaskSortBy,
  DashboardTaskSortDirection,
  DashboardTaskSortSettings,
  DashboardTaskSortSetting,
  getDefaultTaskListSortSettings
} from './embedded-types/dashboard/task/SortSettings';
import {
  DashboardTagSetting,
  DashboardTagSettings
} from './embedded-types/dashboard/userConfig/Tags';
import RequiredUserId from './schemas/required-refs/RequiredUserId';
import { DocumentValidator } from './schemas/validators/DocumentValidator';
import DocumentService, { DocumentMap } from './services/DocumentService';
import DashboardTaskService, {
  DashboardTaskFilterAndSortResult
} from './services/dashboard/Task/TaskService';

// Export all the functions and classes from this library
export {
  User,
  validateUser,
  ApiKey,
  validateApiKey,
  DashboardUserConfig,
  validateDashboardUserConfig,
  DashboardTask,
  RecurrenceFrequencyType,
  RecurrenceBasis,
  RecurrenceEffect,
  DashboardTaskSortBy,
  DashboardTaskSortDirection,
  getDefaultTaskListFilterSettings,
  getDefaultTaskListSortSettings,
  validateDashboardTask,
  DashboardTaskService,
  NonogramKatanaItem,
  NonogramKatanaItemName,
  validateNonogramKatanaItem,
  NonogramKatanaUpgrade,
  NonogramKatanaUpgradeName,
  validateNonogramKatanaUpgrade,
  BaseDocument,
  BaseDocumentWithType,
  RequiredUserId,
  DocumentService
};

// Export TypeScript types where needed
export type {
  DocumentValidator,
  UserCTO,
  DocumentMap,
  RecurrenceInfo,
  RecurrenceFrequency,
  ParentRecurringTaskInfo,
  DashboardTaskMap,
  DashboardTaskListGlobalFilterSettings,
  DashboardTaskFilterSettings,
  DashboardTaskFilterAndSortResult,
  DashboardTaskListFilterSettings,
  DashboardTaskListGlobalSortSettings,
  DashboardTaskSortSettings,
  DashboardTaskListSortSettings,
  DashboardTaskSortSetting,
  DashboardTagSettings,
  DashboardTagSetting
};

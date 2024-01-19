import { ObjectId } from 'bson';
import BaseDocumentWithType from '../BaseDocumentWithType';
import RequiredUserId from '../../schemas/required-refs/RequiredUserId';
import Validate from '../../schemas/validators/ValidateUtil';
import { DocumentValidator } from '../../schemas/validators/DocumentValidator';
import { DashboardTagSettings } from '../../embedded-types/dashboard/userConfig/Tags';
import {
  DashboardTaskListGlobalSortSettings,
  validateSortSettings
} from '../../embedded-types/dashboard/task/SortSettings';
import { validateFilterSettings } from '../../embedded-types/dashboard/task/FilterSettings';

export const validateDashboardUserConfig: DocumentValidator<
  DashboardUserConfig
> = (config: DashboardUserConfig) => {
  const errors: string[] = [];
  const validate = new Validate(config, errors);
  const exampleConfig = new DashboardUserConfig(new ObjectId());

  validate.boolean('enableDevMode', exampleConfig.enableDevMode);
  validate.array('collaborators', exampleConfig.collaborators);
  validate.object('tagSettings', {});
  validateSortSettings(validate, config);
  validateFilterSettings(validate, config);

  return { updatedDoc: config, errors };
};

export default class DashboardUserConfig
  extends BaseDocumentWithType
  implements RequiredUserId
{
  static docType = 'userConfig';

  docType = DashboardUserConfig.docType;

  /**
   * The owner of this config.
   */
  userId: ObjectId;

  /**
   * The different users that the owner of this config is collaborating with
   * on the dashboard.
   */
  collaborators: ObjectId[] = [];

  /**
   * Whether or not to enable dev mode for the user.
   */
  enableDevMode = false;

  /**
   * The user's tag settings for the dashboard.
   */
  tagSettings: DashboardTagSettings = {};

  taskListSortSettings: DashboardTaskListGlobalSortSettings = {};

  taskListFilterSettings: DashboardTaskListGlobalSortSettings = {};

  constructor(ownerId: ObjectId) {
    super();
    this.userId = ownerId;
  }
}

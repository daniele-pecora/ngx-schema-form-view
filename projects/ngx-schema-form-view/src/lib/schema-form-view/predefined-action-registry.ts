import {FormProperty} from 'ngx-schema-form'
import ___default_action_download_model from "./actions/download-model";
import ___default_action_upload_model from "./actions/upload-model";

export class PredefinedActionRegistry {
  register: { [key: string]: (formProperty: FormProperty, parameters: any) => void } = {}

  /**
   * Register here all predefined actions
   */
  constructor() {
    this.add(___default_action_download_model)
    this.add(___default_action_upload_model)
  }

  private add(actionObject: any) {
    this.register = Object.assign(this.register, actionObject)
  }

  /**
   * This will add actions to the form actions only if :<br/>
   * <ul>
   *     <li>Not already exists</li>
   *     <li>A button with the corresponding id exits in schemaform json</li>
   *     <li>A button with the corresponding id exits in schema json</li>
   * </ul>
   * @param targetActions This object will get all actions added
   * @param schemaJson
   * @param schemaformJson
   */
  assignAllActions(targetActions: object, schemaJson?: object, schemaformJson?: object): object {
    const actions = {}

    const _s = JSON.stringify(schemaJson)
    const _f = JSON.stringify(schemaformJson)
    const containsButton = (actionId: string, jsonString: string) => {
      return -1 !== jsonString.indexOf(`"id":"${actionId}"`)
    }
    for (const key of Object.keys(this.register)) {
      if (!targetActions[key] && (containsButton(key, _f) || containsButton(key, _s))) {
        actions[key] = this.register[key]
      }
    }
    if (Object.keys(actions)) {
      return Object.assign(targetActions, actions)
    }
    return targetActions
  }
}


export interface PredefinedAction {
  [key: string]: (formProperty: FormProperty, parameters: any) => void
}

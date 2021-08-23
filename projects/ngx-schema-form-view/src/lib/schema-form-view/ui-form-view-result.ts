import { UIFormViewHelper } from "./ui-form-view-helper"
import { UIFormViewModel } from "./ui-form-view-model"

export class UIFormViewResult {
  /**
   *
   * @param formProperty The form property the button that has triggered the action belongs to (See: angular2-schema-form)
   * @param buttonParams The params of the button that has triggered the action belongs to (See: angular2-schema-form)
   * @param data Any data returned (except <code>false</code>) from the action <code>___before_action___schema_form_final</code>
   *              you want put into in your action method <code>___action___schema_form_final</code>.
   */
  constructor(public formProperty?: any, public buttonParams?: any, public data?: any) {

  }

  /**
   * Constructs the final object applying the mapping from `mapperObject` and reducing to the properties contained in `schemaObject`
   * @param uiFormViewModel The UIFormViewModel providing the `modelObject`, `mapperObject` and `schemaObject`
   * @param trimValues Decide if the string values contained should be trimmed
   * @returns The final object constructed applying the mapping from `mapperObject` and reducing to the properties contained in `schemaObject`
   */
  computeFinalModel(uiFormViewModel: UIFormViewModel, trimValues: boolean) {
    const trimmer = trimValues ? ((key, value) => (typeof value === 'string' ? value.trim() : value)) : null
    const tmp_modelObject = JSON.parse(JSON.stringify(this.formProperty.value), trimmer)
    return new UIFormViewHelper().getFinalModel(tmp_modelObject, uiFormViewModel.mapperObject, uiFormViewModel.schemaObject)
  }
}

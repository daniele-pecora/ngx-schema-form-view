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
}

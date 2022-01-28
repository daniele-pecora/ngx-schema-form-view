import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core'
import mergeDeep from '../ui-form-view.utils'
import { Actions, UIFormViewModel } from './ui-form-view-model'
import { UIFormViewResult } from './ui-form-view-result'
import { PredefinedActionRegistry } from './predefined-action-registry'
import { FormProperty, SchemaValidatorFactory } from 'ngx-schema-form'

const isEqual_Model_Schema_Form = (ui1: UIFormViewModel, ui2: UIFormViewModel) => {
  if (
    JSON.stringify(ui1.schemaObject) === JSON.stringify(ui2.schemaObject)
    && JSON.stringify(ui1.formModelObject) === JSON.stringify(ui2.formModelObject)
    && JSON.stringify(ui1.modelObject) === JSON.stringify(ui2.modelObject)
  ) {
    return true
  }
  return false
}

@Component({
  selector: 'ui-form-view',
  templateUrl: './ui-form-view.component.html'
})
export class UIFormViewComponent implements OnInit, OnChanges {
  @Input()
  noInputMessage = 'No Input!'

  @Input()
  uiInitialFormViewModel: UIFormViewModel

  @Input()
  uiSchemaUpdateString: string

  @Input()
  uiSchemaFormUpdateString: string

  @Input()
  noCard = false

  @Input()
  noSchemaCompile = false

  @Output()
  onModelChange: EventEmitter<UIFormViewModel> = new EventEmitter<UIFormViewModel>()

  /**
   * This emitter will be called form within the automatically create method <code>___action___schema_form_final</code>.
   *
   *
   */
  @Output()
  onModelChangeFinal: EventEmitter<UIFormViewResult> = new EventEmitter<UIFormViewResult>()

  @Output()
  onLoaded: EventEmitter<UIFormViewModel> = new EventEmitter<UIFormViewModel>()

  schemaObject: object
  formModelObject: object
  modelObject: object
  updatedModelObject: object

  /**
   * this is the merge of {@code schemaObject} and {@code formModelObject}
   */
  //finalSchemaObject: object

  __finalSchemaObject: object

  get finalSchemaObject() {
    return this.__finalSchemaObject
  }
  set finalSchemaObject(schema: any) {
    this.__finalSchemaObject = this.compileSchemaIfNeeded(schema)
  }

  _formActions: any
  get formActions() {
    return this._formActions
  }
  set formActions(actions: any) {
    // this._formActions = this.wrapActions(actions)
    this._formActions = actions
  }
  formValidators: any
  formMappings: any
  formBindings: any


  @Output()
  onBeforeAction: EventEmitter<OnActionEvent> = new EventEmitter<OnActionEvent>()

  @Output()
  onAfterAction: EventEmitter<OnActionEvent> = new EventEmitter<OnActionEvent>()

  onChangeFormViewModel: UIFormViewModel

  constructor(private predefinedActionRegistry: PredefinedActionRegistry, private schemaValidatorFactory: SchemaValidatorFactory) {

  }

  compileSchemaIfNeeded(schema: any) {
    if (`${this.noSchemaCompile}` === 'true')
      return schema
    return this.schemaValidatorFactory.compile(schema) || schema
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const uiSchemaUpdateStringChanges: SimpleChange = changes.uiSchemaUpdateString
    const uiSchemaFormUpdateStringChanges: SimpleChange = changes.uiSchemaFormUpdateString
    if (uiSchemaUpdateStringChanges || uiSchemaFormUpdateStringChanges) {
      let doUpdate = false
      let stringSchema
      let stringSchemaForm
      if (uiSchemaUpdateStringChanges
        && !uiSchemaUpdateStringChanges.isFirstChange()
        && uiSchemaUpdateStringChanges.currentValue !== uiSchemaUpdateStringChanges.previousValue
      ) {
        try {
          this.schemaObject = JSON.parse(uiSchemaUpdateStringChanges.currentValue)
          stringSchema = uiSchemaUpdateStringChanges.currentValue
          doUpdate = true
        } catch (e) {
          console.error('no schema update - invalid JSON', e)
        }
      }
      if (uiSchemaFormUpdateStringChanges
        && !uiSchemaFormUpdateStringChanges.isFirstChange()
        && uiSchemaFormUpdateStringChanges.currentValue !== uiSchemaFormUpdateStringChanges.previousValue
      ) {
        try {
          this.formModelObject = JSON.parse(uiSchemaFormUpdateStringChanges.currentValue)
          this.formModelObject = this.prepareFormModelFromSchema(this.schemaObject, this.formModelObject)
          stringSchemaForm = uiSchemaFormUpdateStringChanges.currentValue
          doUpdate = true
        } catch (e) {
          console.error('no schema form update - invalid JSON', e)
        }
      }
      if (doUpdate) {
        /** can be always be done */
        this.modelObject = this.prepareFormModelFromSchema(this.schemaObject, this.formModelObject)
        this.syncUpdatedModel()
        /**
         * we must update from string otherwise change detection does not trigger in sf-form when changing schema object
         */
        if (!stringSchema) {
          stringSchema = JSON.stringify(this.schemaObject)
        }
        if (!stringSchemaForm) {
          stringSchemaForm = JSON.stringify(this.formModelObject)
        }
        this.updateSchemaFormFromString(stringSchema, stringSchemaForm)
      }
    }

    const uiInitialFormViewModelChanges: SimpleChange = changes.uiInitialFormViewModel
    if (uiInitialFormViewModelChanges) {
      let skip_uiFormViewModelChanges =
        (
          uiInitialFormViewModelChanges.currentValue
          && uiInitialFormViewModelChanges.previousValue
          && (null !== uiInitialFormViewModelChanges.currentValue && null !== uiInitialFormViewModelChanges.currentValue)
          && (
            (uiInitialFormViewModelChanges.currentValue === uiInitialFormViewModelChanges.previousValue)
            || isEqual_Model_Schema_Form(uiInitialFormViewModelChanges.currentValue, uiInitialFormViewModelChanges.previousValue)
          )
        )
      /**
       * TODO fix: For some reason {@code uiFormViewModelChanges.currentValue} and {@code uiFormViewModelChanges.previousValue} do always contain the same objects contents (JSON stringify)...
       * ... so don't skip here and reload on any change
       */
      skip_uiFormViewModelChanges = false
      if (!skip_uiFormViewModelChanges) {
        if (uiInitialFormViewModelChanges.currentValue) {

          this.formActions = {}
          this.formActions = uiInitialFormViewModelChanges.currentValue.actionsObject || {}

          this.formValidators = {}
          this.formValidators = uiInitialFormViewModelChanges.currentValue.validatorsObject || {}

          this.formMappings = {}
          this.formMappings = uiInitialFormViewModelChanges.currentValue.mapperObject || {}

          this.formBindings = {}
          this.formBindings = uiInitialFormViewModelChanges.currentValue.bindingsObject || {}

          const _schemaObject = uiInitialFormViewModelChanges.currentValue.schemaObject
          const _formModelObject = uiInitialFormViewModelChanges.currentValue.formModelObject
          const _modelObject = uiInitialFormViewModelChanges.currentValue.modelObject

          /** can be always be done */
          const _prepared_formModelObject = this.prepareFormModelFromSchema(_schemaObject, _formModelObject)

          this.schemaObject = _schemaObject
          this.formModelObject = _prepared_formModelObject
          this.modelObject = _modelObject
          this.syncUpdatedModel()

        } else {

          this.formActions = {}
          this.formValidators = {}
          this.formBindings = {}

          this.schemaObject = { properties: {} }
          this.formModelObject = {}
          this.modelObject = {}
          this.syncUpdatedModel()

          this.formModelObject = this.prepareFormModelFromSchema(this.schemaObject, this.formModelObject)
        }

        this.formActions = this.predefinedActionRegistry.assignAllActions(this.formActions, this.schemaObject, this.formModelObject)

        this.updateSchemaForm()

        this.onChangeFormViewModel = new UIFormViewModel(
          this.schemaObject,
          this.formModelObject,
          /**
           * We must use a second container otherwise array widget will not be able to add new element.<br/>
           * So <code>this.modelObject</code> won't work.<br/>
           * Using <code>this.updatedModelObject</code> instead.<br/>
           */
          // this.modelObject,
          this.updatedModelObject,
          this.formValidators,
          this.formActions,
          this.formMappings,
          this.formBindings)

        this.setupLastChangeEmitterIntoFormActions()
        this.formActions = this.wrapActions(this.formActions)
        this.onChangeFormViewModel.actionsObject = this.formActions

        this.onLoaded.emit(this.onChangeFormViewModel)
      }
    }
  }

  private prepareFormModelFromSchema(schemaObject: object, formModelObject: object) {
    /** make a copy */
    const schemaObjectString: string = this.stringifyJSON(schemaObject)
    const schemaObjectCopy: any = this.parseJSON(schemaObjectString)

    const formModelObject_fromSchema = this.createFormModelFromSchema(schemaObjectCopy)

    const merged_SchemaFormModel = mergeDeep(formModelObject_fromSchema, formModelObject)
    this.removeActionFromButtons(merged_SchemaFormModel)
    return merged_SchemaFormModel
  }

  private createFormModelFromSchema(schemaObject) {
    if (schemaObject.hasOwnProperty('properties')) {
      for (const property in schemaObject.properties) {
        const propertyObject = this.createFormModelFromSchema(schemaObject.properties[property])
        schemaObject.properties[property] = propertyObject
      }
    } else {
      schemaObject = {}
    }
    return schemaObject
  }

  private updateSchemaFormFromString(schemaString, formModelString) {
    try {

      const newSchema: any = schemaString ? JSON.parse(schemaString) : {}
      const newSchemaModel: any = formModelString ? JSON.parse(formModelString) : {}

      const merged = mergeDeep(newSchema, newSchemaModel)

      /**
       * force reloading
       */
      this.finalSchemaObject = {}
      this.finalSchemaObject = merged
      // console.log('updated final schema (from string):', merged)
    } catch (e) {
      console.error('invalid JSON - form model (from string)!!!', e)
    }
  }

  private updateSchemaForm() {
    try {

      const newSchema: object = this.schemaObject || { properties: {} }
      const newSchemaForm: object = this.formModelObject || {}

      const merged = mergeDeep(newSchema, newSchemaForm)

      /**
       * force reloading
       */
      this.finalSchemaObject = merged
      // console.log('updated final schema:', merged)
    } catch (e) {
      console.error('invalid JSON - form model!!!', e)
    }
  }

  private stringifyJSON(data: object): string {
    return JSON.stringify(data, null, 2)
  }

  private parseJSON(data: string): object {
    return JSON.parse(data)
  }

  private syncUpdatedModel() {
    this.updatedModelObject = this.modelObject
  }

  modelChanged(e) {
    try {
      /**
       * We must use a second container otherwise array widget will not be able to add new element.<br/>
       * So <code>this.modelObject = e.value</code> won't work.<br/>
       * Using <code>this.updatedModelObject = e.value</code> instead.<br/>
       */
      this.updatedModelObject = e.value

      this.emitEvent()
    } catch (e) {
      console.error('invalid model!!!', e)
    }
  }

  private resetForm(data) {
    this.schemaObject = null
    this.schemaObject = data || { 'properties': {} }

    this.formModelObject = {}

    this.modelObject = {}
    this.syncUpdatedModel()

    this.finalSchemaObject = this.schemaObject
  }

  private emitEvent() {
    this.onChangeFormViewModel = new UIFormViewModel(
      this.schemaObject,
      this.formModelObject,
      /**
       * We must use a second container otherwise array widget will not be able to add new element.<br/>
       * So <code>this.modelObject</code> won't work.<br/>
       * Using <code>this.updatedModelObject</code> instead.<br/>
       */
      // this.modelObject,
      this.updatedModelObject,
      this.formValidators,
      this.formActions,
      this.formMappings,
      this.formBindings)
    this.onModelChange.emit(this.onChangeFormViewModel)
  }

  private setupLastChangeEmitterIntoFormActions() {
    /**
     * Set up an action called <code>___action___schema_form_final</code> this can be mapped to a button.<br/>
     * This action will emit the final model change <code>onModelChangeFinal</code>.<br/>
     *
     * If their does exist an action called <code>___before_action___schema_form_final</code> <br/>
     * then this will be executed forehand and must return <code>false</code> if execution <br/>
     * should be consumed and stop there to prevent <code>___action___schema_form_final</code> to being executed after.<br/>
     *
     * Returning any other value in <code>___before_action___schema_form_final</code> <br/>
     * will pass it as <code>data</code> property to the <code>onModelChangeFinal</code> emitter.<br/>
     * The model passed to the <code>onModelChangeFinal</code> emitter has following form:<br/>
     * <pre>
     {
              property: {
                   // formProperty
              } ,
              params: {
                   // buttonParams
              } ,
              data: {
                   // any data resulted from method '___before_action___schema_form_final'
              }
         }
     </pre>
     * @param property
     * @param params
     * @private
     */
    this.formActions['___action___schema_form_final'] = (property, params) => {
      let beforeResult
      if (!this.formActions['___before_action___schema_form_final']
        || false !== (beforeResult = this.formActions['___before_action___schema_form_final'](property, params))) {
        const result: UIFormViewResult = new UIFormViewResult(property, params, beforeResult)
        this.onModelChangeFinal.emit(result)
      }
    }

  }

  /**
   * We have to remove all 'actions' from the 'schemaForm' otherwise no form design will be created
   * @param targetObject
   */
  private removeActionFromButtons(targetObject: object): void {
    if (targetObject) {
      for (const prop in targetObject) {
        const propValue = targetObject[prop]
        if (('buttons' === prop) && Array.isArray(propValue)) {
          for (const _p in propValue) {
            delete propValue[_p]['action']
          }
        } else if ('object' === typeof (propValue)) {
          this.removeActionFromButtons(propValue)
        }
      }
    }
  }

  wrapActions(actions: Actions) {
    if (actions) {
      for (const key of Object.keys(actions)) {
        const orgFun = actions[key]
        actions[key] = (formProperty?: FormProperty, parameters?: any) => {
          const actionArgs = { formProperty: formProperty, parameters: parameters }
          if (this.onBeforeAction)
            this.onBeforeAction.emit({ action: actionArgs, uiFormViewModel: this.onChangeFormViewModel })
          try { orgFun.apply(this, [formProperty, parameters]) } catch (e) { console.error('Error processing action:', actionArgs, e) }
          if (this.onAfterAction)
            this.onAfterAction.emit({ action: actionArgs, uiFormViewModel: this.onChangeFormViewModel })
          return
        }
      }
    }
    return actions
  }
}

export interface OnActionEvent {
  action: {
    formProperty: FormProperty,
    parameters: any
  }
  uiFormViewModel: UIFormViewModel
}
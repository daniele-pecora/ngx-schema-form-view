import { Component, OnInit } from '@angular/core'
// import {UIFormViewHelper} from 'ngx-schema-form-view'
// import {UIFormViewTemplateService} from 'ngx-schema-form-view'
// import {UIFormViewModel} from 'ngx-schema-form-view'
// import {UIFormViewResult} from 'ngx-schema-form-view'
import { HttpClient } from '@angular/common/http'

// see 'typings.d.ts' how this works with json files
import form_model from './__forms/demo/model.json'
import form_schema from './__forms/demo/schema.json'
import form_schemaform from './__forms/demo/schemaform.json'
import form_mappings from './__forms/demo/mapper'
import form_actions from './__forms/demo/action'
import form_validations from './__forms/demo/validation'
import form_bindings from './__forms/demo/bindings'
// import {Actions, Bindings, Mappings, Validators} from 'ngx-schema-form-view'
import { forkJoin, from as fromPromise, of } from 'rxjs'

import {
  Actions, Bindings, Mappings, Validators
  , UIFormViewHelper
  , UIFormViewTemplateService
  , UIFormViewModel
  , UIFormViewResult
} from '../../dist/ngx-schema-form-view'
import { FormProperty, LogService } from 'ngx-schema-form'

declare var System: any

export interface OnActionEvent {
  action: {
    formProperty: FormProperty,
    parameters: any
  }
  uiFormViewModel: UIFormViewModel
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UIFormViewTemplateService, HttpClient]
})
export class AppComponent implements OnInit {
  title = 'ngx-schema-form-view-app'

  // creating all assets within this instance

  modelObject = form_model
  schemaObject = form_schema
  schemaFormObject = form_schemaform
  validatorsObject: Validators = form_validations
  actionsObject: Actions = form_actions
  mapperObject: Mappings = form_mappings
  bindingsObject: Bindings = form_bindings

  uiInitialFormViewModel: UIFormViewModel
  finalModelObject: object
  actualModelObject: object

  get onChangeFormViewModel() {
    return this.actualModelObject as UIFormViewModel
  }

  constructor(private templateLoaderService: UIFormViewTemplateService,
    private logger: LogService,) {

  }
  // POC how to have global action event listener
  onBeforeAction(event: OnActionEvent) {
    console.log('onBeforeAction', event)
  }
  // POC how to have global action event listener
  onAfterAction(event: OnActionEvent) {
    console.log('onAfterAction', event)
  }

  // POC how to have global action event listener
  wrapActions(actions: Actions) {
    for (const key of Object.keys(actions)) {
      const orgFun = actions[key]
      actions[key] = (formProperty?: FormProperty, parameters?: any) => {
        const actionArgs = { formProperty: formProperty, parameters: parameters }
        // <before>
        this.onBeforeAction({ action: actionArgs, uiFormViewModel: this.onChangeFormViewModel })
        try { orgFun.apply(this, [formProperty, parameters]) } catch (e) { this.logger.error('Error processing action:', actionArgs, e) }
        // <after>
        this.onAfterAction({ action: actionArgs, uiFormViewModel: this.onChangeFormViewModel })
        return
      }
    }
    return actions
  }

  // loading all assets from files in folder 'src/assets/demo'
  loadTemplateFromFiles() {

    const path = './__forms/demo/'
    forkJoin(
      System.import(`${path}action.ts`),
      System.import(`${path}validation.ts`),
      System.import(`${path}mapper.ts`),
      System.import(`${path}bindings.ts`)
    ).subscribe((results) => {
      console.log('results', results)
    })

    this.templateLoaderService
      .loadFormTemplate('./__forms', 'demo', (string) => {
        return string.replace('${apiKey}', 'TEST-API-KEY')
      })
      .subscribe((result: UIFormViewModel) => {
        console.log('RESULT', result)

        this.schemaObject = result.schemaObject
        this.schemaFormObject = result.formModelObject
        this.validatorsObject = result.validatorsObject
        this.actionsObject = /*POC how to have global action event listener */this.wrapActions(result.actionsObject)
        this.mapperObject = result.mapperObject
        this.bindingsObject = result.bindingsObject
      })
  }

  getModelFromViewModelAssetsObjects() {
    let finalModelObject = null
    // you can either create the final model object from service...
    finalModelObject = this.templateLoaderService.getFinalModel(this.modelObject, this.mapperObject, this.schemaObject)
    // ... or directly form helper class
    finalModelObject = new UIFormViewHelper().getFinalModel(this.modelObject, this.mapperObject, this.schemaObject)
  }

  getModelFromViewModel(): UIFormViewModel {
    // you can also create the final model object from an UIFormViewModel instance
    const uiInitialFormViewModel: UIFormViewModel = {
      schemaObject: this.schemaObject,
      formModelObject: this.schemaFormObject,
      modelObject: this.modelObject,
      validatorsObject: this.validatorsObject,
      actionsObject: /*POC how to have global action event listener */this.wrapActions(this.actionsObject),
      mapperObject: this.mapperObject,
      bindingsObject: this.bindingsObject
    }
    return new UIFormViewHelper().createFinalModelObject(uiInitialFormViewModel) as UIFormViewModel
  }


  onFormViewLoaded(event: UIFormViewModel) {
    console.log('onFormViewLoaded', event)
  }

  onModelComplete(event: UIFormViewResult) {
    console.log('onModelComplete', event)
  }

  onModelChange(event: UIFormViewModel) {
    console.log('onModelChange', event)
    this.actualModelObject = event.modelObject
    this.finalModelObject = new UIFormViewHelper().createFinalModelObject(event) as UIFormViewModel
    console.log('this.finalModelObject', this.finalModelObject)
  }

  ngOnInit(): void {
    const uiInitialFormViewModel: UIFormViewModel = {
      schemaObject: this.schemaObject,
      formModelObject: this.schemaFormObject,
      modelObject: this.modelObject,
      validatorsObject: this.validatorsObject,
      actionsObject: this.actionsObject,
      mapperObject: this.mapperObject,
      bindingsObject: this.bindingsObject
    }
    this.uiInitialFormViewModel = uiInitialFormViewModel

    // this.loadTemplateFromFiles()
  }
}
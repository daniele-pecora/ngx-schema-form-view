# Usage

Using this form requires to provide an object of type `UIFormViewComponent` containing the properties:

- _schemaObject_
- _formModelObject_
- _modelObject_
- _validatorsObject_
- _actionsObject_
- _bindingsObject_
- _mapperObject_


### Explaination

1. schemaObject

    The JSON schema describing the model for the input data.  
    Must be pure json and not containing any functions.  
    This may be the representation of the data how the data structure is specified by a backend.  
    See https://json-schema.org/understanding-json-schema/ for more information.  
    
2. formModelObject

    The extension of the JSON schema that allows to design the final view of the form.  
    Must be pure json and not containing any functions.  
    See https://github.com/makinacorpus/ngx-schema-form for more information.  

3. modelObject

    This file will contain any default data that may be set prior prompting the user for data.  
    Must be pure json and not containing any functions.  
    See https://github.com/guillotinaweb/ngx-schema-form#actions-and-buttons for more information.  

4. actionsObject

    This file will contain actions that may be mapped via buttons definitions in the _formModelObject_.  
    Must contain _key_ and _values_ where the key must match to a button id and  
    the value must be a function that gets the corresponding `formProperty` as argument.  
    See https://github.com/makinacorpus/ngx-schema-form for more information.  

    There are some [default submit actions](./_readme/ACTIONS_DEFAULT.MD) to use with a `form` or `wizard` widget  
    when handling the moment when the data is sent to the service. (see [here](./_readme/ACTIONS_DEFAULT.MD))  

    More then that there are also some [predefined actions](./_readme/ACTIONS_PREDEFINED.MD) that may be useful. (see [here](./_readme/ACTIONS_PREDEFINED.MD))  


5. validatorsObject

    This file allows to define validation rules that overflow the abilities of JSON schema.  
    Must contain _key_ and _values_ where the key must match to a property name from the _schema_ and  
    the value must be a function that gets the corresponding `formProperty` as argument.  
    See https://github.com/guillotinaweb/ngx-schema-form#advanced-validation for more information.  

6. bindingsObject

    This file will contain all necessary event bindings.  
    Must contain _key_ and _values_ where the key must match to a property path of the current model object  
    and value will contain an array of event listeners.  
    See https://github.com/guillotinaweb/ngx-schema-form#custom-bindings for more information.  
    
7. mapperObject

    This file will contain all necessary mappings to be done on the result model.  
    Must contain _key_ and _values_ where the key must match to a property name of the current model object  
    and value will contain properties matching the target model object.  
    This is used to convert the model json to a structure that the backend-server will accept.  
    See https://www.npmjs.com/package/object-mapper for more information.  

8. noInputMessage

    This message text will be shown instead if for any reason the form could not be generated  

Head over to the [ngx project git repository](https://github.com/guillotinaweb/ngx-schema-form) for more documentation


### Example usage

Import module in your `app.module.ts`
```angular2html
    import {UIFormViewModule} from 'ngx-schema-form-view'

    @NgModule({
      ...
      imports: [
        ...

        , UIFormViewModule.forRoot() // because of the shared service 'UIFormViewTemplateService'
        ...
      ]
      ...
    })
    export class AppModule {
        ...
    }
```

In HTML template

```angular2html
      <ui-form-view
        *ngIf="uiInitialFormViewModel"
        [noCard]="true"
        [uiInitialFormViewModel]="uiInitialFormViewModel"
        (onLoaded)="onFormViewLoaded($event)"
        (onModelChangeFinal)="onModelComplete($event)"
        noInputMessage="Form couldn't be generated!"
      ></ui-form-view>
```

In your component.ts
```typescript
    import {Component} from '@angular/core'
    import {UIFormViewModel, UIFormViewHelper, UIFormViewTemplateService} from 'ngx-schema-form-view'
    import {Actions, Bindings, Mappings, Validators} from 'ngx-schema-form-view'

    @Component({
        providers: [UIFormViewTemplateService]
    })
    export class MyComponent {

        // creating all assets within this instance
        modelObject:object = {}
        schemaObject:object = {
            type:'object',
            properties: {
              search: {
                type: 'string',
                title: '',
                description: 'Search for any applications',
                minLength: 1,
                maxLength: 100
              }
            }
        }
        schemaFormObject:object = {
            widget:{
              'id':'form',
              'buttons':[
                    {
                       id:"___action___schema_form_final",
                       label:"Submit form"
                    }]
            },
           properties:{
              search:{
                 placeholder:'Find here...',
                 widget:{
                    id:'string',
                    size:35,
                    prefix:[
                       {
                          icon:'search',
                          text:''
                       }
                    ],
                    'validationMessages':{
                       'NO_SEARCH_YET':'Text search is still development in progress...'
                    }
                 },
                 buttons:[
                    {
                       id:"reset",
                       label:"Reset"
                    }
                 ]
              }
           }
        }
        validatorsObject:Validators = {
        '/search': (value, property, form_current) => {
          if (!value) {
            return null
          }
          const error = {
            code: 'NO_SEARCH_YET',
            path: `#${property._path}`,
            message: '',
            params: [value],
            severity: 'info',
            title: 'Attention:'
          }
          return error
        }
        }
        actionsObject:Actions = {
          'reset': (property) => { property.reset() }
        }
        mapperObject:Mappings = {
          'search':'request.queryString'
        },
        bindingObject:Bindings = {
          '/search':[{
            'input': (event?: any, formProperty?: FormProperty): void => {
                          console.log('input value: ',formProperty.value)
                     }
          }]
        }

        uiInitialFormViewModel: UIFormViewModel
        constructor(private templateLoaderService: UIFormViewTemplateService){

                const uiInitialFormViewModel: UIFormViewModel = {
                  schemaObject: this.schemaObject,
                  formModelObject: this.schemaFormObject,
                  modelObject: this.modelObject,
                  validatorsObject: this.validatorsObject,
                  actionsObject: this.actionsObject,
                  mapperObject: this.mapperObject,
                  bindingsObject: this.bindingsObject
                };
                this.uiInitialFormViewModel = uiInitialFormViewModel;
        }

        getModelFromViewModelAssetsObjects(){
            let finalModelObject = null
            // you can either create the final model object from service...
            finalModelObject = this.templateLoaderService.getFinalModel(this.modelObject, this.mapperObject, this.schemaObject)
            // ... or directly form helper class
            finalModelObject = new UIFormViewHelper().getFinalModel(this.modelObject, this.mapperObject, this.schemaObject)
        }

        getModelFromViewModel(){
            // you can also create the final model object from an UIFormViewModel instance
            const uiInitialFormViewModel: UIFormViewModel = {
                schemaObject: this.schemaObject,
                formModelObject: this.schemaFormObject,
                modelObject: this.modelObject,
                validatorsObject: this.validatorsObject,
                actionsObject: this.actionsObject,
                mapperObject: this.mapperObject,
                bindingsObject: this.bindingsObject
            }
            return new UIFormViewHelper().createFinalModelObject(uiInitialFormViewModel)
        }


    }
```

**UIFormViewTemplateService** is not yet active...


## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

#### Live preview

Try it out in the demo app

```bash
$ npm start
```

## Versions

- 1.x Version are for Angular 9
- 0.0.x Version are for Angular 8 and before

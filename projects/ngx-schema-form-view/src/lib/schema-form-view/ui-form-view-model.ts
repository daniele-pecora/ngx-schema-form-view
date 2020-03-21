import {FormProperty, PropertyGroup} from 'ngx-schema-form/lib/model/formproperty';

export interface Mappings {
  [sourceProperty: string]: string | {
    key: string,
    transform: (value) => any,
    default: ((value) => any | string | number)
  } | any[]
}

export interface Bindings {
  [path: string]: [
    {
      [eventId: string]:
        (event?: any, formProperty?: FormProperty | any) => void | ((event?: any, formProperty?: FormProperty | any) => void)[]
    }
    ]
}

export interface Actions {
  [buttonId: string]: /* this method signature is directly ported from ngx-schema-form Action.ts */ (formProperty?: FormProperty, parameters?: any) => void;
}

export interface Validators {
  [path: string]: /* this method signature is directly ported from ngx-schema-form Validator.ts */ ((value: any, formProperty?: FormProperty, form?: PropertyGroup) => { [key: string]: any; }|[{ [key: string]: any; }] | void);
}

export class UIFormViewModel {

  /**
   *
   * @param schemaObject     The JSON schema describing the model for the input data.<br/>
   *                                  Must be pure json and not containing any functions
   * @param formModelObject     The extension of the JSON schema that allows to design the final view of the form.<br/>
   *                                     Must be pure json and not containing any functions
   * @param modelObject This file will contain any default data that may be set prior prompting the user for data.<br/>
   *                             Must be pure json and not containing any functions
   * @param validatorsObject     This file allows to define validation rules that overflow the abilities of JSON schema.<br/>
   *                                      Must contain _key_ and _values_ where the key must match to a property name from the _schema_ and<br/>
   *                                      the value must be a function that gets the corresponding `formProperty` and the `form` as argument.
   * @param actionsObject     This file will contain actions that may be mapped via buttons definitions in the _schemaform_.<br/>
   *                                   Must contain _key_ and _values_ where the key must match to a button id and<br/>
   *                                   the value must be a function that gets the corresponding `formProperty` and some parameters defined in the button object as argument.<br/>
   *                                   See https://github.com/makinacorpus/ngx-schema-form for more information.<br/>
   * @param mapperObject     This file will contain all necessary mappings to be done on the result model.<br/>
   *                                  Must contain _key_ and _values_ where the key must match to a property name of the current model object<br/>
   *                                  and value will contain properties matching the target model object.<br/>
   *                                  e.g:<br/>
   *                                  <code>'person.name':'person.names[0]'</code><br/>
   *                                  See https://www.npmjs.com/package/object-mapper for more information.<br/>
   * @param bindingsObject  This file will allows to define custom bindings to the widgets.<br/>
   *                        Must contain _key_ and _values_ where the key must match a json schema _path_ mapped to a<br/>
   *                        value of an array of <code>{[eventId]:(event:any,formProperty:FormProperty)=>void}</code>.<br/>
   *                        See also 'Custom bindings' documentation of <code>ngx-schema-form</code> project at https://github.com/makinacorpus/ngx-schema-form
   */
  constructor(
    public schemaObject: object,
    public formModelObject: object,
    public modelObject: object,
    public validatorsObject: Validators,
    public actionsObject: Actions,
    public mapperObject?: Mappings,
    public bindingsObject?: Bindings
  ) {
  }
}

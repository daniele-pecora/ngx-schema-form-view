import json_schema_filter from 'json-schema-filter'
import json_object_mapper from 'object-mapper'
import { UIFormViewModel } from './ui-form-view-model'

export class UIFormViewHelper {
  /**
   * This method will re-map all properties by using {@link UIFormViewModel#mapperObject}
   * and filter all properties by using the schema {@link UIFormViewModel#schemaObject}
   * @see {@link UIFormViewHelper#getFinalModel(object,object,object,boolean)}
   * @param uIFormViewModel
   * @param trimValues Decide if the string values contained should be trimmed
   * @returns
   */
  public createFinalModelObject(uIFormViewModel: UIFormViewModel, trimValues?: boolean) {
    return this.getFinalModel(uIFormViewModel.modelObject, uIFormViewModel.mapperObject, uIFormViewModel.schemaObject, trimValues)
  }

  /**
   * Constructs the final object applying the mapping from `mapperObject` and reducing to the properties contained in `schemaObject`.<br/>
   * remap the properties by the mapper defined in <code>mapper.ts</code><br/>
   * filter all properties not contained in schema definition <code>schema.json</code>
   * @param modelObject The object to remap and filter
   * @param mapperObject Defines all properties that should get remapped
   * @param schemaObject The schema that defines all properties that should remain in model. All other will get removed.
   * @param trimValues Decide if the string values contained should be trimmed
   * @returns The final object constructed applying the mapping from `mapperObject` and reducing to the properties contained in `schemaObject`
   */
  public getFinalModel(modelObject: object, mapperObject: object, schemaObject: object, trimValues?: boolean): object {
    let _o
    if (modelObject) {
      const trimmer = trimValues ? ((key, value) => (typeof value === 'string' ? value.trim() : value)) : null
      _o = JSON.parse(JSON.stringify(modelObject, trimmer))
      if (mapperObject && Object.keys(mapperObject).length) {
        _o = this.model_remap(_o, _o, mapperObject)
      }
      if (schemaObject && Object.keys(schemaObject).length) {
        _o = this.model_filter(_o, schemaObject)
      }
    }
    return _o
  }

  /**
   * remap the model object
   * @param fromModelObject
   * @param toModelObject
   * @param mapperObject See : https://www.npmjs.com/package/object-mapper
   */
  public model_remap(fromModelObject: any, toModelObject: any, mapperObject: object): object {
    return json_object_mapper(fromModelObject, toModelObject, mapperObject)
  }

  /**
   * remove all properties not contained in schema definition
   * @param modelObject
   * @param schemaObject See: https://www.npmjs.com/package/json-schema-filter
   * @returns
   */
  public model_filter(modelObject: any, schemaObject: object): object {
    return json_schema_filter(schemaObject, modelObject)
  }
}

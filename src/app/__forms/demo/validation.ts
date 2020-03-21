import {FormProperty, PropertyGroup} from 'ngx-schema-form/lib/model/formproperty';

export const validations = {
  'person/name': (value: any, property: FormProperty, form_current: PropertyGroup): any => {
    if (!value) {
      return null;
    }
    const error = {
      code: 'NO_NAME_YET',
      path: `#${property.path}`,
      message: '',
      params: [value],
      severity: 'info',
      title: 'Attention:'
    };
    return error;
  },
  'person/forename': (value: any, property: FormProperty, form_current: PropertyGroup): any => {
    if (!value) {
      return null;
    }
    const error = {
      code: 'NO_FORENAME_YET',
      path: `#${property.path}`,
      message: '',
      params: [value],
      severity: 'info',
      title: 'Attention:'
    };
    return error;
  }
};


export default validations;

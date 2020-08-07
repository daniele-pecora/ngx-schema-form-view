import {FormProperty} from 'ngx-schema-form';
import {Bindings} from '../../../../dist/ngx-schema-form-view';

export const bindings: Bindings = {
  '/forename': [{
    'input': (event?: any, formProperty?: FormProperty): void => {
      const parent = formProperty.findRoot();
      const property: FormProperty = parent.getProperty('name');
      if (formProperty.value) {
        property.schema.placeholder = `${formProperty.value}'s Family-name`;
      } else {
        property.schema.placeholder = ''
      }
    },
    'change': (event?: any, formProperty?: FormProperty): void => {
      const parent = formProperty.findRoot();
      const property: FormProperty = parent.getProperty('hobbies');
      if (formProperty.value) {
        property.schema.title = `${formProperty.value}'s Hobbies X`;
      } else {
        property.schema.title = '';
      }
    }
  }]
};

export default bindings;

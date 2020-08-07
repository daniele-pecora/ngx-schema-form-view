import {Actions} from '../../../../dist/ngx-schema-form-view';
import {FormProperty} from 'ngx-schema-form';

export const actions: Actions = {
  'reset': (property: FormProperty): void => {
    console.log('prop:', property);
    property.setValue(null, false);
  }
};

export default actions;

import {Actions} from '../../../../dist/ngx-schema-form-view';
import {FormProperty} from 'ngx-schema-form/lib/model/formproperty';

export const actions: Actions = {
  'reset': (property: FormProperty): void => {
    console.log('prop:', property);
    property.setValue(null, false);
  }
};

export default actions;

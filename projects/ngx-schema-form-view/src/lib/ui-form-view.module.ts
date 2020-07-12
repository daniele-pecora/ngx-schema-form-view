import {CommonModule} from '@angular/common'
import {ModuleWithProviders, NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {SchemaFormModule} from 'ngx-schema-form'
// TODO expose this service to load all form template assets
import {UIFormViewTemplateService} from './ui-form-view-template.service'
import {UIFormViewComponent} from './schema-form-view/ui-form-view.component'
import {PredefinedActionRegistry} from './schema-form-view/predefined-action-registry'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SchemaFormModule
  ],
  declarations: [UIFormViewComponent],
  exports: [UIFormViewComponent],
  providers: [PredefinedActionRegistry]
})
export class UIFormViewModule {
  static forRoot(): ModuleWithProviders<UIFormViewModule> {
    return {
      ngModule: UIFormViewModule,
      // TODO expose this service to load all form template assets, then the module must be called with .forRoot()
      providers: [UIFormViewTemplateService]
    };
  }
}

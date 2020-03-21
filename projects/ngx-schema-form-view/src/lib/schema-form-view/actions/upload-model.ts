import {PredefinedAction} from "../predefined-action-registry";
import {FormProperty} from "ngx-schema-form";

export interface PredefinedActionUploadOptions {
  upload: {
    /**
     * The message show in an alert dialog when the upload succeeds.<br/>
     * If empty no alert will be shown.<br/>
     */
    success?: string
    /**
     * The message show in an alert dialog when the upload fails.<br/>
     * If empty no alert will be shown.<br/>
     */
    error?: string
    /**
     * The path pointing to the property whose value will be set from the uploaded file.<br/>
     * Usually an path separated by <code>/</code><br/>
     * but <code>.</code> may be also used.
     */
    property?: string
  }
}

export const ___default_action_upload_model: PredefinedAction = {
  '___default_action_upload_model': (property: FormProperty, params: PredefinedActionUploadOptions = {upload: {}}) => {
    const options = params.upload || {}
    const _error = options.error
    const _success = options.success
    const _path = (options.property || '').replace(new RegExp('[.]', 'gi'), '/')
    const _root = property.findRoot()
    const _target = (_path && _root.getProperty(_path)) || _root

    const upload = () => {
      const fileupload = document.createElement('input')
      fileupload.type = 'file'
      fileupload.style.display = 'none'
      fileupload.style.cssText = `opacity:0; height:0px;width:0px;`
      fileupload.accept = 'application/json'
      document.body.appendChild(fileupload)

      fileupload.onchange = (event) => {
        event.preventDefault()
        const reader = new FileReader()

        reader.onerror = (error) => {
          if (_error) {
            alert(_error)
          }
          console.error('Upload failed: Reader error.', error)
        }
        const onReady = (filename, textContent) => {
          try {
            const val = JSON.parse(textContent)
            _target.setValue(val, false)
            if (_success) {
              alert(_success)
            }
          } catch (e) {
            if (_error) {
              alert(_error)
            }
            console.error('Upload failed: Incompatible file \'' + filename + '\'.', e, 'Content:', textContent)
          }
        }

        reader.onloadend = function (evt) {
          if (evt.target['readyState'] === FileReader.DONE) {
            onReady(fileupload.files[0].name, evt.target['result'])
          }
        }
        reader.readAsText(fileupload.files[0], fileupload.files[0].name)
        document.body.removeChild(fileupload)
      }
      fileupload.click()
    }
    upload()
  }
}
export default ___default_action_upload_model

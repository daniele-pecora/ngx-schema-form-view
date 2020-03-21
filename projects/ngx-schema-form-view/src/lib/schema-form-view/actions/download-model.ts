import {PredefinedAction} from "../predefined-action-registry";
import {FormProperty} from "ngx-schema-form";

export interface PredefinedActionDownloadOptions {
  download: {
    /**
     * Open a dialog that lets change the download file name.<br/>
     * If empty the download begins immediately.<br/>
     */
    prompt?: string
    /**
     * The download file name.<br/>
     */
    name?: string
    /**
     * The path pointing to the property that will be converted to JSON to being downloaded.<br/>
     * Usually an path separated by <code>/</code><br/>
     * but <code>.</code> may be also used.
     */
    property?: string
  }
}

export const ___default_action_download_model: PredefinedAction = {
  '___default_action_download_model': (property: FormProperty, params: PredefinedActionDownloadOptions = {download: {}}) => {

    const options = params.download || {}
    const _prompt = options.prompt
    const _path = (options.property || '').replace(new RegExp('[.]', 'gi'), '/')
    const _root = property.findRoot()
    const _target = (_path && _root.getProperty(_path)) || _root

    const _create_file_name = (prop: FormProperty) => {
      const datePart = new Date().toLocaleString(/*'DE-de'*/)
        .replace(new RegExp('[.:/]', 'gi'), '-')
        .replace(', ', '_')
        .replace(' ', '_')
      return `${(prop.schema['title'] || prop.schema['name'] || 'Download')}-${datePart}.json`
    }
    const _download = (options.name) || _create_file_name(_target)

    const download = (mimeType, filename, text) => {
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(new Blob([text], {type: mimeType}))
      a.download = filename
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    const customFilename = _prompt ? prompt(_prompt, _download) : _download
    if (customFilename) {
      const value = JSON.stringify(_target.value, null, 2)
      download('application/json',
        customFilename + (!customFilename.toLowerCase().endsWith('.json') ? '.json' : ''),
        value)
    }
  }
}
export default ___default_action_download_model

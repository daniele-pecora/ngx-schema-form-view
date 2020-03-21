# Predefined actions

Predefined actions can be assigned to any button of a widget.

Specific settings must be provided via the `parameters` argument of a button action.

Example

```json
    {
      "label": "My Button",
      "id" : "___action_id",
      "parameters": {
        "specific_options": {
          "option1": "A value",
          "option2": "Some value",
          "option4": "Some other value"
        }
      }
    }
```

## Download current work

Allows to download a specific path of the current model json as json file.

The action id is `___default_action_download_model`

### Options

The option are described by the type [`PredefinedActionDownloadOptions`](./../projects/ui-ngx-form-view-nsf/src/lib/ui-form-view/actions/download-model.ts)

### Full example

```json
    {
      "label": "Save",
      "description": "Save your work to continue at a later time.",
      "iconPos": "left",
      "severity": "info",
      "icon": "save",
      "id": "___default_action_download_model",
      "parameters": {
        "download": {
          "property": "",
          "name": "Form-Download.json",
          "prompt": "Save as ..."
        }
      }
    }
```

## Load a stored work

Allows to upload a previously stored work into the current form.

The action id is `___default_action_upload_model`

### Options

The option are described by the type [`PredefinedActionUploadOptions`](./../projects/ui-ngx-form-view-nsf/src/lib/ui-form-view/actions/upload-model.ts)

### Example

```json
    {
      "label": "Load",
      "description": "Continue a previously saved application.",
      "iconPos": "left",
      "severity": "success",
      "icon": "file-download",
      "id": "___default_action_upload_model",
      "parameters": {
        "upload": {
          "property": "",
          "success": "Successfully uploaded.",
          "error": "Can't upload file. May be incompatible."
        }
      }
    }
```

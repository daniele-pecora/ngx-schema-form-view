# Default Submit Actions



###### ___action___schema_form_final
An action `___action___schema_form_final` will be set automatically.

This action id can be mapped to any button you like to use for submitting the data to a service.

Then the json model will then be send to the widgets `service.url` property   
of a `form` or `wizard` widget defined in the `schemaform.json`.


###### ___before_action___schema_form_final
Also an action `___before_action___schema_form_final` will be set automatically.

This action will be called before `___action___schema_form_final`.

Make `___before_action___schema_form_final` return `false` to prevent `___action___schema_form_final`
for being executed.

Returning any other value in `___before_action___schema_form_final`
will pass it as data property to the onModelChangeFinal emitter.

The model passed to the onModelChangeFinal emitter has following form:
```
 {
      property: {
           // formProperty
      } ,
      params: {
           // buttonParams
      } ,
      data: {
           // any data resulted from method '___before_action___schema_form_final'
      }
 } 
```

So your action may be look like :
```typescript
   export const actions = {
        "___before_action___schema_form_final":(property, params)=>{
            if('payment_now'===params.payment){
                return 'payment_now'
            }else if('payment_later'===params.payment){
                return 'payment_later'
            }
        }
    }
```

then in your `onModelChangeFinal(event)`
```typescript
    onModelChangeFinal(event: UiFormViewResult) {
        if('payment_now' === event.data){
            // do payment now ...
        } else if('payment_later' === event.data){
            // do payment later ...
        }
    }
```


### Multiple submit actions

When you need multiple submit actions it still is possible to use the finalizing action `___action___schema_form_final`
on different buttons.
To differ between which button has triggered the action button `parameters` can be used.
This button `parameters` can be evaluated in pre-final action `___before_action___schema_form_final` and return a meaningful value.

Then the button object may look like

```
     buttons:[  
        {  
           id:"reset",
           label:"Reset"
        },
        {
            id:"___action___schema_form_final",
            label:"Submit",
            icon:'send'
            parameters:{
                custom_prop:'custom_command1'
            }
        },
         {
             id:"___action___schema_form_final",
             label:"Submit later",
             icon:'send'
             parameters:{
                 custom_prop:'custom_command2'
             }
         }
        
     ]
```

and the action object may look like

```
  {
      'reset': (property) => { property.reset() },
      '___before_action___schema_form_final': (property, parameters) => {
        debugger
        if ('custom_command1' === parameters.custom_prop) {
          return 'custom_command1'
        } else if ('custom_command2' === parameters.custom_prop) {
          return 'custom_command2'
        }
      }
```

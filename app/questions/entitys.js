const fieldsOptions = [
  {
    type: 'input',
    name: 'fieldName',
    message: `What's the name of the field?`
  },
  {
    type: 'list',
    name: 'fieldType',
    message: `What's the field's type?`,
    choices: [
      {
        name: 'String',
        value: 'String'
      },
      {
        name: 'Number',
        value: 'Number'
      },
      {
        name: 'Date',
        value: 'Date'
      },
      {
        name: 'Boolean',
        valeu: 'Boolean'
      }
    ]
  },
  {
    type: 'confirm',
    name: 'required',
    message: `Is the field required?`
  }
]
module.exports = fieldsOptions

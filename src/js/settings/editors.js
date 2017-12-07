import editorBoolean from '../components/editors/boolean'
import editorFile from '../components/editors/file'
import editorInteger from '../components/editors/integer'
import editorText from '../components/editors/text'
import editorTextfield from '../components/editors/textfield'

let editors = {
    boolean: editorBoolean,
    file: editorFile,
    integer: editorInteger,
    text: editorText,
    textfield: editorTextfield
}

export default editors

// load theme styles with webpack
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/beagle.css';
 
// ES module
import Editor from 'react-medium-editor';

const MediumEditor = (props) => {
  return (
    <Editor {...props} />
  );
};

export default MediumEditor;

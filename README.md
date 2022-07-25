# react-piano
Added selection mechanism to react-piano component. 
Mousedown on a key toggle selection.

## Usage
Controlled usage:
```javascript
import { Piano } from 'react-piano';
import 'react-piano/dist/styles.css';

function MyApp() {
  const [selectedNotes, setSelectedNotes] = useState([]);

  const handleSelectionChanged = (selectedNotes: number[]) => {
    setSelectedNotes(selectedNotes);
  }
  
  return (
    <div>
      <Piano
        enableSelection  // add this prop to enable selection
        onSelectionChanged={handleSelectionChanged}
        selectedNotes={selectedNotes}  // midi numbers
        /* ...other props */ />
    </div>
  );
}
```

Customize style of selected key:
```CSS
.ReactPiano__Key--selected {
  background: green;
}
```

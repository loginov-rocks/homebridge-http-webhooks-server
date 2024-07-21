import { PushButton } from './PushButton.mjs';
import { Switch } from './Switch.mjs';

export const accessoriesMap = new Map();

accessoriesMap.set('pushbuttons', PushButton);
accessoriesMap.set('switches', Switch);

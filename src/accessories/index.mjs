import { Light } from './Light.mjs';
import { PushButton } from './PushButton.mjs';
import { Switch } from './Switch.mjs';

export const accessoriesMap = new Map();

accessoriesMap.set('lights', Light);
accessoriesMap.set('pushbuttons', PushButton);
accessoriesMap.set('switches', Switch);

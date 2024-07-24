import { Light } from './Light.mjs';
import { Outlet } from './Outlet.mjs';
import { PushButton } from './PushButton.mjs';
import { Switch } from './Switch.mjs';
import { Thermostat } from './Thermostat.mjs';

export const accessoriesMap = new Map();

accessoriesMap.set('lights', Light);
accessoriesMap.set('outlets', Outlet);
accessoriesMap.set('pushbuttons', PushButton);
accessoriesMap.set('switches', Switch);
accessoriesMap.set('thermostats', Thermostat);

import { ContactSensor } from './ContactSensor.mjs';
import { HumiditySensor } from './HumiditySensor.mjs';
import { Light } from './Light.mjs';
import { Outlet } from './Outlet.mjs';
import { PushButton } from './PushButton.mjs';
import { Switch } from './Switch.mjs';
import { TemperatureSensor } from './TemperatureSensor.mjs';
import { Thermostat } from './Thermostat.mjs';

const sensorsMap = new Map();

sensorsMap.set('contact', ContactSensor);
sensorsMap.set('humidity', HumiditySensor);
sensorsMap.set('temperature', TemperatureSensor);

export const accessoriesMap = new Map();

accessoriesMap.set('lights', Light);
accessoriesMap.set('outlets', Outlet);
accessoriesMap.set('pushbuttons', PushButton);
accessoriesMap.set('switches', Switch);
accessoriesMap.set('sensors', sensorsMap);
accessoriesMap.set('thermostats', Thermostat);

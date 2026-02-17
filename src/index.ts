/* global Cypress */

import './mailosaurCommands';
import { register } from './register';

declare const Cypress: any;

register(Cypress);

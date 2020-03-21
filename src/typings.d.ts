/**
 * Allow to import JSON as modules
 * <code>import myjson from './myjsonfile.json'</code>
 */
declare module '*.json' {
  const value: any;
  export default value;
}

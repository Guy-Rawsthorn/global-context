import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { PartialJSONValue } from '@lumino/coreutils'
import { ICommandPalette } from '@jupyterlab/apputils';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { ReactWidgetWrapper } from './react-wrapper';
import { reactIcon } from '@jupyterlab/ui-components';

const PLUGIN_ID = '@jupyterlab/global-context:settings-example';

/**
 * Initialization data for the @jupyterlab/settings extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  description: 'A JupyterLab extension.',
  autoStart: true,
  requires: [ISettingRegistry, ICommandPalette],
  activate: (
    app: JupyterFrontEnd,
    settingsRegistry: ISettingRegistry,
    palette: ICommandPalette
  ) => {
    console.log('JupyterLab Context Store extension activated!');

    // async function due to settingsRegistry load
    async function registerCommands() {
      // Load settings
      const settings = await settingsRegistry.load(PLUGIN_ID);

      // Command to Save Data
      const saveCommandId = 'context-store:save';
      app.commands.addCommand(saveCommandId, {
        label: 'Save Context Data',
        execute: async (args) => {
          if (!args || !args.data || typeof args.data !== 'object') {
            console.error("No data received in save command.");
            return;
          }
          await settings.set('context', args.data as PartialJSONValue);
          console.log('Context set to:', args.data);
        }
      });

      // Command to Retrieve Data
      const fetchCommandId = 'context-store:get';
      app.commands.addCommand(fetchCommandId, {
        label: 'Get Context Data',
        execute: async () => {
          const storedData = settings.get('context').composite;
          console.log('Retrieved context:', storedData);
        }
      });

      // Command to open react widget
      const commandPostJsonContext = 'json-context:open';
      app.commands.addCommand(commandPostJsonContext, {
        caption: 'Open JSON Context React Widget',
        label: 'Execute json-context-widget:open',
        icon: args => (args['isPalette'] ? null : reactIcon),
        execute: () => {
          console.log('extension activated');
          const content = new ReactWidgetWrapper(app.commands, saveCommandId);
          const widget = new MainAreaWidget<ReactWidgetWrapper>({ content });
          widget.title.label = 'JSON Context';
          app.shell.add(widget, 'main');
        }
      });

      // ✅ Add commands to Command Palette
      palette.addItem({ command: saveCommandId, category: 'Custom Commands' });
      palette.addItem({ command: fetchCommandId, category: 'Custom Commands' });
      palette.addItem({
        command: commandPostJsonContext,
        category: 'Custom Commands'
      });
    }
    registerCommands();
  }
};

export default plugin;

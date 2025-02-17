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
import { notebookActions } from './notebook-actions';

const PLUGIN_ID = '@jupyterlab/global-context:settings-example';

const FETCH_COMMAND_ID = 'context-store:get'
const SAVE_COMMAND_ID = 'context-store:save'

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

    async function registerCommands() {

      const settings = await settingsRegistry.load(PLUGIN_ID);

      // Command to Save Data
      app.commands.addCommand(SAVE_COMMAND_ID, {
        label: 'Save Global Context Data',
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
      app.commands.addCommand(FETCH_COMMAND_ID, {
        label: 'Get Global Context Data',
        execute: async () => {
          const storedData = settings.get('context').composite;
          console.log('Retrieved context:', storedData);
        }
      });

      // Command to open react widget
      const openGlobalContextReactWidget = 'context-store-widget:open';
      app.commands.addCommand(openGlobalContextReactWidget, {
        // caption: 'Open Global Context React Widget',
        label: 'Open Global Context React Widget',
        icon: args => (args['isPalette'] ? null : reactIcon),
        execute: () => {
          console.log('extension activated');
          const content = new ReactWidgetWrapper(app.commands, SAVE_COMMAND_ID);
          const widget = new MainAreaWidget<ReactWidgetWrapper>({ content });
          widget.title.label = 'Context Store';
          app.shell.add(widget, 'main');
        }
      });

      // Add commands to Command Palette
      palette.addItem({ command: SAVE_COMMAND_ID, category: 'Global Context' });
      palette.addItem({ command: FETCH_COMMAND_ID, category: 'Global Context' });
      palette.addItem({
        command: openGlobalContextReactWidget,
        category: 'Global Context'
      });
    }
    registerCommands();
    notebookActions(app.commands, FETCH_COMMAND_ID);
  }
};

export default plugin;

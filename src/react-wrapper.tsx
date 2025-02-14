import { ReactWidget } from '@jupyterlab/ui-components';
import React from 'react';
// import { createRoot } from 'react-dom/client';
import JsonCodeBlock from './widget'; // Import React component
import { CommandRegistry } from '@lumino/commands';

/**
 * A Lumino Widget that wraps the JSON Code Block React Component.
 */
export class ReactWidgetWrapper extends ReactWidget {
  private commands: CommandRegistry;
  private saveCommandId: string;

  constructor(commands: CommandRegistry, saveCommandId: string) {
    super();
    this.commands = commands;
    this.saveCommandId = saveCommandId;
    this.addClass('jp-react-widget');
  }

  render(): JSX.Element {
    return <JsonCodeBlock commands={this.commands} saveCommandId={this.saveCommandId} />
  }
}
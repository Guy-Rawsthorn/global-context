import { CommandRegistry } from '@lumino/commands';
import { NotebookActions } from '@jupyterlab/notebook';
import { Cell, ICellModel } from '@jupyterlab/cells';

export const notebookActions = (commands: CommandRegistry, fetchCommandId: string) => {
    NotebookActions.executionScheduled.connect((_: any, args: any) => {
        const cell: Cell<ICellModel> = args['cell'];
        const executedCode = cell.model.sharedModel.source
        commands.execute(fetchCommandId)
        console.log(executedCode)
    });
}
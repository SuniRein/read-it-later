import type { Command } from '@/utils/types';

import { browser } from '#imports';

type CommandHandlers = Record<Command, () => void>;

export function handleCommand(handlers: CommandHandlers) {
    browser.commands.onCommand.addListener((command: string) => {
        if (Object.prototype.hasOwnProperty.call(handlers, command)) {
            handlers[command as Command]();
        }
        else {
            console.warn(`No handler for command: ${command}`);
        }
    });
}

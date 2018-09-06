/*
 * Copyright (c) 2018-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { injectable, inject } from "inversify";
import { RemoteWebSocketConnectionProvider } from "./remote-connection";
import { IBaseTerminalServer, CONNECT_TERMINAL_SEGMENT } from "./base-terminal-protocol";
import URI from "@theia/core/lib/common/uri";
// import { URI } from '@theia/core/lib/common'

export type TerminalProxyCreatorProvider = () => Promise<TerminalProxyCreator>;

@injectable()
export class TerminalProxyCreator {

    private server: IBaseTerminalServer;

    constructor(@inject(RemoteWebSocketConnectionProvider) protected readonly connProvider :RemoteWebSocketConnectionProvider,
                @inject("term-api-end-point") protected readonly apiEndPoint: string,
            ) {
    }

    create(): IBaseTerminalServer  {
        if (!this.server) {
            const uri = new URI(this.apiEndPoint).resolve(CONNECT_TERMINAL_SEGMENT);
            console.log("Connect url" + uri);
            this.server = this.connProvider.createProxy<IBaseTerminalServer>(uri.toString());
        }
        return this.server;
    }
}

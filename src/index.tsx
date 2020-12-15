import 'regenerator-runtime/runtime';
import { auto } from 'browser-unhandled-rejection';
import { serviceWorkerUpdate } from 'web-utility/source/event';
import { documentReady, render, createCell } from 'web-cell';

import { session } from './model';
import { PageRouter } from './page';

auto();

self.addEventListener('unhandledrejection', event => {
    const { reason } = event;
    const message: string = reason instanceof Error ? reason.message : reason;

    if (message)
        if (reason.code === 400 && message.startsWith('must login')) {
            if (self.confirm('会话超时，马上退出系统去重新登录？'))
                session.signOut();
        } else self.alert(message);
});

const { serviceWorker } = window.navigator;

if (process.env.NODE_ENV !== 'development')
    serviceWorker
        ?.register('sw.js')
        .then(serviceWorkerUpdate)
        .then(worker => {
            if (window.confirm('检测到新版本，是否立即启用？'))
                worker.postMessage({ type: 'SKIP_WAITING' });
        });

serviceWorker?.addEventListener('controllerchange', () =>
    window.location.reload()
);

documentReady.then(() =>
    render(<PageRouter />, document.querySelector('#root'))
);

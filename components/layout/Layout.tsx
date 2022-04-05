import React, { PropsWithChildren } from 'react';
import { Image } from 'react-bootstrap';
import { MainNavigation } from './MainNavigation';

export const Layout: React.FC = ({ children }: PropsWithChildren) => (
    <>
        <MainNavigation />

        <main className="mt-5 pt-5">{children}</main>

        <footer className="flex-fill d-flex justify-content-center align-items-center border-top py-4">
            <a
                className="flex-fill d-flex justify-content-center align-items-center"
                href="https://github.com/idea2app/Next-Bootstrap-ts"
                target="_blank"
                rel="noopener noreferrer"
            >
                由
                <span className="mx-2">
                    <Image src="/nextjs.png" alt="Next Logo" width={48} />
                </span>
                idea2app 脚手架强力驱动
            </a>
        </footer>
    </>
);
